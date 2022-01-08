import React, { useEffect } from "react"
import { useState } from "react"
import { Button, Modal } from "react-bootstrap"
import Cookies from "universal-cookie/es6"
import { get } from "../api"

const AdminViewAdminDetail = ({ show, onHide, userId }) => {
  const [token] = useState(new Cookies().get("token"))
  const [resUser, setResUser] = useState()
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
      const res = await get(`/admin/${userId}`, token)
      console.log("userDetail - res", res)
      setResUser(res)
    } catch (error) {
      console.log("userDetail - error", error)
    }
  }

  useEffect(() => {
    userId && token && userDetail()
  }, [userId, token])

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName="cus-rounded-1dot5rem"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Chi tiết quản trị viên
        </Modal.Title>
      </Modal.Header>
      <Modal.Body as="table" className="m-3">
        <tr>
          <td>ID:</td>
          <td>{resUser?._id}</td>
        </tr>
        <tr>
          <td>Tên:</td>
          <td>{resUser?.name}</td>
        </tr>
        <tr>
          <td>Ngày tạo:</td>
          <td>
            {new Date(resUser?.createdAt).toLocaleDateString("vi-VN", options)}
          </td>
        </tr>
        <tr>
          <td>Ngày cập nhật gần nhất:</td>
          <td>
            {new Date(resUser?.updatedAt).toLocaleDateString("vi-VN", options)}
          </td>
        </tr>
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

export default AdminViewAdminDetail
