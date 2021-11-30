import React, { useContext, useState } from "react"
import {
  Button,
  FormControl,
  Image,
  InputGroup,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import * as XLSX from "xlsx"
import { ThemeColorContext } from "."
import SendingEmail from "../../components/SendingEmail"
import { downloadTemplate } from "../../config/helper"
import { post } from "../../api"
import Cookies from "universal-cookie"

const MemberPage = ({
  students,
  teachers,
  resClassroom,
  isHost,
  isTeacher,
}) => {
  const [isShowEmailInput, setIsShowEmailInput] = useState(false)
  const [isToast, setIsToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [inviteTeacher, setInviteTeacher] = useState(false)
  const [uploadFile, setUploadFile] = useState(false)
  const { register, setValue } = useForm()
  const [token] = useState(new Cookies().get("token"))
  const [preStudentList, setPreStudentList] = useState(
    resClassroom?.unmappedStudents
  )

  const themeColorContext = useContext(ThemeColorContext)

  const renderItem = (item, id, mode, verify = false) => {
    return (
      <div key={id} className="d-flex border-bottom p-3 align-items-center">
        <Image
          src={`/images/avatar.png`}
          fluid
          className="rounded-circle border bg-white"
          style={{ width: "3rem", height: "3rem" }}
        />
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="h5 ps-3 m-0">
            {item?.name}
            {verify && (
              <i className="ms-3 bi bi-patch-check-fill text-primary" />
            )}
          </div>
          <div className="fs-6">{mode === 1 && item?.studentId}</div>
        </div>
      </div>
    )
  }

  const renderToast = () => {
    return (
      <ToastContainer className="p-3" position="bottom-center">
        <Toast
          onClose={() => setIsToast(false)}
          show={isToast}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <div
              className="me-3 rounded text-white text-center"
              style={{
                width: "30px",
                height: "20px",
                backgroundColor: resClassroom?.themeColor,
              }}
            >
              <i className="bi bi-check2" />
            </div>
            <strong className="me-auto">{toastMsg}</strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>
    )
  }

  const handleFile = (e) => {
    try {
      setUploadFile(true)

      const files = e.target.files,
        f = files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        const res = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        )

        let formatData = []

        for (let row of res) {
          formatData.push({ studentId: row["MSSV"], name: row["Tên"] })
        }

        const body = { classroomId: resClassroom._id, studentList: formatData }

        postPreStudentList(body)
        console.log("handleFile - body", body)

        reader.DONE && alert("check the log in the console")
      }

      reader.readAsArrayBuffer(f)
    } catch (error) {
      console.log("handleFile - error", error)
    } finally {
      setUploadFile(false)
      setValue("file", null)
    }
  }

  const postPreStudentList = async (body) => {
    try {
      const res = await post(`/set-student-list`, token, {}, body)
      setPreStudentList(res.unmappedStudents)
    } catch (error) {
      console.log("postPreStudentList - error", error)
    }
  }

  const genSampleData = () => {
    const temp = [["Mã học viên", "Tên"]]

    for (let item of students) {
      temp.push(Object.values({ studentId: item?.studentId, name: item?.name }))
    }

    for (let item of preStudentList) {
      temp.push(Object.values({ studentId: item?.studentId, name: item?.name }))
    }

    return temp
  }

  return (
    <div className="w-100">
      {renderToast()}

      <SendingEmail
        classRoomCode={resClassroom?.code}
        isShowEmailInput={isShowEmailInput}
        setIsShowEmailInput={setIsShowEmailInput}
        setIsToast={setIsToast}
        setToastMsg={setToastMsg}
        inviteTeacher={inviteTeacher}
      />

      <div className="mb-5">
        <div
          className="border-bottom px-3 py-4 d-flex"
          style={{ color: themeColorContext }}
        >
          <div className="h2 mb-0">Giáo viên</div>
          <div className="h6 mb-0 m-auto me-0">
            {teachers?.length} người
            <i
              className="ms-3 fs-3 cursor-pointer bi bi-person-plus-fill"
              onClick={() => {
                setIsShowEmailInput(true)
                setInviteTeacher(true)
              }}
            />
          </div>
        </div>
        {teachers?.map((teacher, id) => renderItem(teacher, id, 0))}
      </div>

      <div>
        <div
          className="border-bottom px-3 py-4 d-flex"
          style={{ color: themeColorContext }}
        >
          <div className="h2 mb-0">Học viên</div>
          <div className="h6 mb-0 m-auto me-0">
            {Number(students?.length || 0) +
              Number(preStudentList?.length || 0)}{" "}
            người
            <i
              className="ms-3 fs-3 cursor-pointer bi bi-person-plus-fill"
              onClick={() => {
                setIsShowEmailInput(true)
                setInviteTeacher(false)
              }}
            />
          </div>
        </div>

        {isTeacher && (
          <div className="ps-3 pb-4 border-bottom">
            <Button
              onClick={() =>
                downloadTemplate(genSampleData(), "student_list_template")
              }
              variant="outline-secondary"
              size="sm"
              className="my-4"
            >
              <i className="bi bi-download me-2" />
              Tải xuống biểu mẫu danh sách học viên
            </Button>
            {isHost && (
              <InputGroup>
                <FormControl
                  size="sm"
                  type="file"
                  {...register("file")}
                  accept=".xlsx"
                  onChange={(e) => handleFile(e)}
                />
                <Button variant="secondary" className="" disabled size="sm">
                  {uploadFile ? (
                    <Spinner
                      size="sm"
                      variant="light"
                      animation="border"
                      className="me-2"
                    />
                  ) : (
                    <i className="bi bi-upload me-2" />
                  )}
                  Tải lên danh sách học viên
                </Button>
              </InputGroup>
            )}
          </div>
        )}

        {students?.map((student, id) => renderItem(student, id, 1, true))}
        {preStudentList?.map((student, id) => renderItem(student, id, 1))}
      </div>
    </div>
  )
}

export default MemberPage
