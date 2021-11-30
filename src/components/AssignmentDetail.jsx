import React, { useContext, useEffect, useState } from "react"
import { Modal, Button, Table, Form, Spinner } from "react-bootstrap"
import Cookies from "universal-cookie"
import { get, post } from "../api"
import { downloadTemplate } from "../config/helper"
import { ThemeColorContext } from "../pages/ClassroomPage"

const AssignmentDetail = ({
  isShowDetail,
  handleClose,
  assignment,
  classroom,
}) => {
  const themeColor = useContext(ThemeColorContext)
  const [token] = useState(new Cookies().get("token"))
  const [gradeList, setGradeList] = useState()
  const [allStudents, setAllStudents] = useState()
  const [currentGrade, setCurrentGrade] = useState(-1)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    setAllStudents([...classroom?.students, ...classroom?.unmappedStudents])
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
      console.log("postGradeForStudent - res", res)
    } catch (error) {
      console.log("postGradeForStudent - error", error)
    } finally {
      setIsLoading(false)
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

  useEffect(() => {
    if (classroom && assignment) {
      getGradeList()
      mergeArray()
    }
  }, [assignment, classroom])

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
        <div className="d-flex justify-content-between py-4 px-5 border-bottom">
          <div className="h4">Tổng điểm: {assignment?.point}</div>
          <Button
            onClick={() =>
              downloadTemplate(
                [
                  ["Mã học viên", "Số điểm"],
                  ["18127156", 10],
                ],
                "grade_list_template"
              )
            }
            variant="outline-secondary"
            size="sm"
          >
            <i className="bi bi-download me-2" />
            Tải xuống biểu mẫu danh sách học viên
          </Button>
        </div>
        <div className="p-5">
          <Table borderless className="border rounded">
            <tbody className="rounded-3">
              <tr style={{ backgroundColor: themeColor }}>
                <td className="text-white fs-3">MSSV</td>
                <td className="text-white fs-3">Tên đầy đủ</td>
                <td className="text-white fs-3">Số điểm</td>
              </tr>
              {allStudents?.map((student, id) => (
                <tr key={id}>
                  <td>{student?.studentId}</td>
                  <td>{student?.name}</td>
                  <td className="d-flex align-items-center">
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
                    <div className="fs-3 mx-3">/</div>
                    <div className="fs-3">{assignment?.point}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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
    </Modal>
  )
}

export default AssignmentDetail
