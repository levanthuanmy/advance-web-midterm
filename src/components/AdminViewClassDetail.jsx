import React, { useEffect, useState } from "react"
import { Button, Modal, Table } from "react-bootstrap"
import Cookies from "universal-cookie/es6"
import { get } from "../api"

const AdminViewClassDetail = ({ show, onHide, classroom }) => {
  const [token] = useState(new Cookies().get("token"))
  const [resStudents, setResStudents] = useState()
  const [resTeachers, setResTeachers] = useState()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }

  const userDetail = async () => {
    try {
      const listTeachers = []
      const listStudents = []

      for (let t of classroom?.teachers) {
        listTeachers.push(await get(`/admin/user/${t}`, token))
      }
      for (let s of classroom?.students) {
        listStudents.push(await get(`/admin/user/${s}`, token))
      }

      setResStudents(listStudents)
      setResTeachers(listTeachers)
    } catch (error) {
      console.log("userDetail - error", error)
    }
  }

  useEffect(() => {
    classroom && userDetail()
  }, [classroom])

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName="cus-rounded-1dot5rem"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Chi tiết lớp học
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless hover>
          <tbody>
            <tr>
              <td>ID:</td>
              <td>{classroom?._id}</td>
            </tr>
            <tr>
              <td>Mã mời:</td>
              <td>{classroom?.code}</td>
            </tr>
            <tr>
              <td>Tên:</td>
              <td>{classroom?.name}</td>
            </tr>
            <tr>
              <td>Ngày tạo:</td>
              <td>
                {new Date(classroom?.createdAt).toLocaleDateString(
                  "vi-VN",
                  options
                )}
              </td>
            </tr>
            <tr>
              <td>Ngày cập nhật gần nhất:</td>
              <td>
                {new Date(classroom?.createdAt).toLocaleDateString(
                  "vi-VN",
                  options
                )}
              </td>
            </tr>
            <tr>
              <td>Mô tả:</td>
              <td>{classroom?.description}</td>
            </tr>
            <tr>
              <td>Môn học:</td>
              <td>{classroom?.subject}</td>
            </tr>
            <tr>
              <td>Phòng học:</td>
              <td>{classroom?.room}</td>
            </tr>
            <tr>
              <td>Ảnh bìa:</td>
              <td>{classroom?.banner}</td>
            </tr>
            <tr>
              <td>Màu chủ đề:</td>
              <td>
                <span
                  style={{ backgroundColor: classroom?.themeColor }}
                  className="text-white rounded-3 py-1 px-3"
                >
                  {classroom?.themeColor}
                </span>
              </td>
            </tr>
            <tr>
              <td>Giảng viên:</td>
              <td>
                {resTeachers?.map((teacher) => (
                  <div>• {teacher.name}</div>
                ))}
              </td>
            </tr>
            <tr>
              <td>Học viên:</td>
              <td>
                {resStudents?.map((student) => (
                  <div>• {student.name}</div>
                ))}
              </td>
            </tr>
            <tr>
              <td>Học viên chưa đăng nhập vào hệ thống:</td>
              <td>
                {classroom?.unmappedStudents?.map((student) => (
                  <div>• {student.name}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="cus-rounded-dot75rem"
          variant="secondary"
          onClick={onHide}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AdminViewClassDetail
