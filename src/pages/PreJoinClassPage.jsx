import React, { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import Cookies from "universal-cookie"
import { get, post } from "../api"
import CustomSpinner from "../components/CustomSpinner"
import { simpleDecode } from "../config/helper"
import useQuery from "../hooks/useQuery"

const PreJoinClassPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useQuery()
  const [isShow, setIsShow] = useState(true)

  const cookies = new Cookies()

  const joinClassroom = async () => {
    try {
      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${cookies.get("token")}`,
      }

      const classCode = query.get("code")

      if (query.get("email")) {
        const email = simpleDecode(query.get("email"))
        console.log("joinClassroom - email", email)

        const body = { email, classCode }
        await post(`/classrooms/invite-teacher`, {}, body, headers)
      } else {
        await get(`/classrooms/join/${classCode}`, {}, headers)
      }

      setIsShow(false)
      navigate(`/c/${id}`)
    } catch (error) {
      console.log("joinClassroom - error", error)
      alert(error)
      cookies.remove("token")
      window?.location?.reload()
    }
  }

  useEffect(() => {
    if (cookies.get("token")?.length && cookies.get("token") !== "undefined") {
      joinClassroom()
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
    </Modal>
  )
}

export default PreJoinClassPage
