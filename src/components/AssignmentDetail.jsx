import React, { useContext, useEffect, useState } from "react"
import {
  Modal,
  Button,
  Table,
  Form,
  Spinner,
  InputGroup,
  FormControl,
  Row,
  Col,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { get, post } from "../api"
import { downloadTemplate } from "../config/helper"
import { ThemeColorContext } from "../pages/ClassroomPage"
import * as XLSX from "xlsx"
import ReviewRequestModal from "./ReviewRequestModal"
import GradeReview from "./GradeReview"

const AssignmentDetail = ({
  isShowDetail,
  handleClose,
  assignment,
  classroom,
  isTeacher,
  students,
}) => {
  const themeColor = useContext(ThemeColorContext)
  const [token] = useState(new Cookies().get("token"))
  const [gradeList, setGradeList] = useState()
  const [allStudents, setAllStudents] = useState()
  const [currentGrade, setCurrentGrade] = useState(-1)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, setValue } = useForm()
  const [isShow, setIsShow] = useState(false)
  const [resReviewId, setResReviewId] = useState(null)

  const getGradeList = async () => {
    try {
      setIsLoading(true)
      const res = await get(
        `/grade-list/${classroom?._id}/${assignment?._id}`,
        token
      )

      setGradeList(res)
    } catch (error) {
      console.log("getGradeList - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const mergeArray = () => {
    if (isTeacher) {
      setAllStudents([...students, ...classroom?.unmappedStudents])
    } else {
      setAllStudents([
        students?.find(
          (student) => student?.studentId === gradeList[0].studentId
        ),
      ])
    }
  }

  const getGradeOfStudent = (student) => {
    const grade = gradeList?.find(
      (item) => item?.studentId === student?.studentId
    )?.grade

    if (grade !== -1)
      return gradeList?.find((item) => item?.studentId === student?.studentId)
        ?.grade
    else return null
  }

  const postGradeForStudent = async (body) => {
    try {
      setIsLoading(true)
      const res = await post(`/set-grade-list`, token, {}, body)
      setGradeList(res)
      console.log("postGradeForStudent - res", res)
    } catch (error) {
      console.log("postGradeForStudent - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const postGrade = (studentId, newGrade) => {
    if (newGrade) {
      postGradeForStudent({
        classroomId: classroom?._id,
        assignmentCode: assignment?._id,
        gradeList: [{ studentId, grade: newGrade }],
      })
    } else {
      postGradeForStudent({
        classroomId: classroom?._id,
        assignmentCode: assignment?._id,
        gradeList: [
          {
            studentId,
            grade: gradeList?.find((item) => item?.studentId === studentId)
              ?.grade,
          },
        ],
      })
    }
  }

  const handleGrade = (e, studentId) => {
    if (isError) {
      e.target.value = e.target.defaultValue
      alert(`Số điểm cần nằm trong khoảng từ 0 đển ${assignment?.point}`)
      setIsError(false)
      return
    }

    if (currentGrade) {
      postGradeForStudent({
        classroomId: classroom?._id,
        assignmentCode: assignment?._id,
        gradeList: [{ studentId, grade: currentGrade }],
      })
    }
  }

  const handleChange = (e) => {
    const tempValue = e?.target?.value
    if (tempValue < 0 || tempValue > assignment?.point) {
      setIsError(true)
    } else {
      setIsError(false)
      setCurrentGrade(e?.target?.value)
    }
  }

  const genSampleData = () => {
    const temp = [["Mã học viên", "Số điểm"]]

    for (let item of gradeList) {
      temp.push(
        Object.values({
          studentId: item?.studentId,
          point: item?.grade !== -1 ? item?.grade : null,
        })
      )
    }

    return temp
  }

  const handleFile = (e) => {
    try {
      setIsLoading(true)

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
          formatData.push({
            studentId: row["Mã học viên"],
            grade: row["Số điểm"],
          })
        }

        const body = {
          classroomId: classroom?._id,
          assignmentCode: assignment?._id,
          gradeList: formatData,
        }

        postGradeForStudent(body)
        console.log("handleFile - body", body)

        reader.DONE && alert("Tải điểm thành công")
      }

      reader.readAsArrayBuffer(f)
    } catch (error) {
      console.log("handleFile - error", error)
    } finally {
      setIsLoading(false)
      setValue("file", null)
    }
  }

  useEffect(() => {
    if (classroom && assignment) {
      getGradeList()
      students && mergeArray()
    }
    return () => setGradeList(null)
  }, [assignment, classroom, students, isTeacher])

  return (
    <Modal
      show={isShowDetail}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      fullscreen
    >
      <Modal.Header closeButton>
        <div className="w-100 text-center h2" style={{ color: themeColor }}>
          {assignment?.name}
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="d-flex justify-content-between align-items-center py-4 px-5 border-bottom">
          <div className="h4">Tổng điểm: {assignment?.point}</div>
          <div>
            <Button
              className="mb-3 float-end"
              onClick={() =>
                downloadTemplate(genSampleData(), "grade_list_template")
              }
              variant="outline-secondary"
              size="sm"
            >
              <i className="bi bi-download me-2" />
              Tải xuống biểu mẫu bảng điểm
            </Button>
            {isTeacher && (
              <InputGroup>
                <FormControl
                  size="sm"
                  type="file"
                  {...register("file")}
                  accept=".xlsx"
                  onChange={(e) => handleFile(e)}
                />
                <Button variant="secondary" className="" disabled size="sm">
                  {isLoading ? (
                    <Spinner
                      size="sm"
                      variant="light"
                      animation="border"
                      className="me-2"
                    />
                  ) : (
                    <i className="bi bi-upload me-2" />
                  )}
                  Tải lên bảng điểm
                </Button>
              </InputGroup>
            )}
          </div>
        </div>
        <Row className="m-0">
          <Col xs="12" lg="6" className="p-5 panel">
            <Table borderless hover className="shadow">
              <tbody className="rounded-3">
                <tr style={{ backgroundColor: themeColor }}>
                  <td className="text-white fs-4 px-3 ps-5">Mã học viên</td>
                  <td className="text-white fs-4 px-3">Tên đầy đủ</td>
                  <td className="text-white fs-4 px-3 pe-5">Số điểm</td>
                </tr>
                {allStudents?.map((student, id) => (
                  <tr key={id}>
                    <td className="px-3 ps-5 fs-6">{student?.studentId}</td>
                    <td className="px-3 fs-6">{student?.name}</td>
                    <td className="d-flex align-items-center px-3 pe-5">
                      {isTeacher ? (
                        <Form.Control
                          size="sm"
                          type="number"
                          min="0"
                          max={assignment?.point}
                          maxLength={String(assignment?.point).length}
                          defaultValue={getGradeOfStudent(student)}
                          onChange={(e) => handleChange(e)}
                          onBlur={(e) => handleGrade(e, student?.studentId)}
                        />
                      ) : (
                        <div className="fs-4">
                          {getGradeOfStudent(student) || "_"}
                        </div>
                      )}
                      <div className="fs-4 mx-3">/</div>
                      <div className="fs-4">{assignment?.point}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col xs="12" lg="6" className="p-5 ps-0">
            {!Boolean(isTeacher) && (
              <>
                {Boolean(assignment?.isFinal) && (
                  <Button
                    className="cus-rounded-dot75rem"
                    onClick={() => setIsShow(true)}
                  >
                    Tạo yêu cầu phúc khảo
                  </Button>
                )}
                <GradeReview
                  isTeacher={Boolean(isTeacher)}
                  gradeList={gradeList}
                  resReviewId={resReviewId}
                />
              </>
            )}
            {Boolean(isTeacher) &&
              gradeList?.map((item, id) =>
                item.reviewId ? (
                  <GradeReview
                    key={id}
                    isTeacher={Boolean(isTeacher)}
                    resReviewId={item.reviewId}
                    studentId={item.studentId}
                    postGrade={postGrade}
                  />
                ) : (
                  <></>
                )
              )}
          </Col>
        </Row>
      </Modal.Body>

      {isLoading && (
        <div className="position-fixed bottom-0 left-0 ps-5">
          <div className="rounded-pill px-4 py-3 border shadow-sm mb-4 fw-bold text-secondary bg-white">
            <Spinner
              variant="secondary"
              size="sm"
              animation="border"
              className="me-3"
            />
            Đang cập nhật
          </div>
        </div>
      )}

      <ReviewRequestModal
        show={isShow}
        onHide={() => setIsShow(false)}
        maxGrade={assignment?.point}
        classroomId={classroom?._id}
        assignmentCode={assignment?._id}
        setResReviewId={setResReviewId}
      />
    </Modal>
  )
}

export default AssignmentDetail
