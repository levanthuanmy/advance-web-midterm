import React, { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import { get } from "../api"
import CustomSpinner from "../components/CustomSpinner"
import useQuery from "../hooks/useQuery"
import HandleLogin from "../components/HandleLogin"

const PreJoinClassPage = ({ resClassrooms, setResClassrooms }) => {
  const navigate = useNavigate()
  const query = useQuery()
  const [isShow, setIsShow] = useState(true)
  const [isShowLogin, setIsShowLogin] = useState(false)

  const cookies = new Cookies()

  const joinClassroom = async () => {
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${cookies.get("token")}`,
    }

    const classCode = query.get("code")

    await get(`/classrooms/join/${classCode}`, {}, headers)

    setIsShow(false)
  }

  useEffect(() => {
    if (cookies.get("token")?.length) {
      joinClassroom()
    } else {
      setIsShowLogin(true)
    }
  }, [cookies.get("token")])

  return (
    <Modal
      show={isShow}
      onHide={() => setIsShow(false)}
      backdrop="static"
      centered
      keyboard={false}
      className="cus-bg-special-pattern"
    >
      <div className="w-100 cus-title-login-modal text-white h2 m-0 d-flex flex-column justify-content-end align-items-center">
        <div className="mb-3">
          Chào mừng đến với <strong>My Classroom</strong>
        </div>
      </div>

      <Modal.Body className="text-center">
        <CustomSpinner />
        <div className="fs-3 pt-4">
          Đang tiến hành tham gia lớp học. Bạn đợi chút nhé!
        </div>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Quay lại
        </Button>
      </Modal.Body>

      <HandleLogin isShowLogin={isShowLogin} setIsShowLogin={setIsShowLogin} />
    </Modal>
  )
}

export default PreJoinClassPage
