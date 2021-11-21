import emailjs from "emailjs-com"
import React, { useContext, useState } from "react"
import {
  Button,
  Form,
  Image,
  Modal,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import { ThemeColorContext } from "."
import {
  emailPattern,
  MAIL_API_KEY,
  MAIL_SERVICE_ID,
  MAIL_TEMPLATE_ID,
} from "../../config/constants"
import { simpleEncode } from "../../config/helper"

const MemberPage = ({ students, teachers, resClassroom }) => {
  const [isShowEmailInput, setIsShowEmailInput] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isToast, setIsToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const themeColorContext = useContext(ThemeColorContext)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm()

  const renderItem = (item, id, mode) => {
    return (
      <div key={id} className="d-flex border-bottom p-3 align-items-center">
        <div className="fs-3 me-3">#{id + 1}</div>
        <Image
          src={`/images/avatar.png`}
          fluid
          className="rounded-circle border bg-white"
          style={{ width: "3rem", height: "3rem" }}
        />
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="h5 ps-3 m-0">{item?.name}</div>
          <div className="fs-6">{mode === 1 && item?.studentId}</div>
        </div>
      </div>
    )
  }

  const sendEmail = async (message, to_email, to_name = " ") => {
    try {
      setIsSending(true)

      const res = await emailjs.send(
        MAIL_SERVICE_ID,
        MAIL_TEMPLATE_ID,
        {
          from_name: "MyClassroom",
          to_name,
          message,
          to_email,
          reply_to: "none",
        },
        MAIL_API_KEY
      )
      console.log("sendEmail - res", res)

      setIsSending(false)
      setIsShowEmailInput(false)
      setToastMsg("Gửi lời mời thành công")
      setIsToast(true)
    } catch (error) {
      console.log("sendEmail - error", error)
    }
  }

  const onSubmitEmail = () => {
    const inviteLink =
      window?.location?.href +
      `/join?code=${resClassroom?.code}&email=${simpleEncode(
        getValues("toEmail")
      )}`
    !isSending && sendEmail(inviteLink, getValues("toEmail"))
    reset()
    console.log("onSubmitEmail - inviteLink", inviteLink)
  }

  const renderEmailInputModal = () => (
    <Modal
      show={isShowEmailInput}
      onHide={() => {
        setIsShowEmailInput(false)
        reset()
      }}
      size=""
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Gửi lời mời đến email
        </Modal.Title>
      </Modal.Header>

      <Form className="" onSubmit={handleSubmit(onSubmitEmail)}>
        <Form.Group className="p-4">
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            placeholder="Nhập email người gửi"
            {...register("toEmail", {
              required: "Bạn cần nhập email",
              pattern: emailPattern,
            })}
          />
          {errors.toEmail && (
            <small className="text-danger">{errors.toEmail?.message}</small>
          )}
        </Form.Group>
        <Modal.Footer>
          {isSending && (
            <Spinner size="sm" variant="secondary" animation="border" />
          )}
          <Button variant="primary" type="submit" disabled={isSending}>
            Gửi
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )

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

  return (
    <div className="w-100">
      {renderToast()}
      {renderEmailInputModal()}
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
              onClick={() => setIsShowEmailInput(true)}
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
            {students?.length} người
            <i className="ms-3 fs-3 cursor-pointer bi bi-person-plus-fill" />
          </div>
        </div>
        {students?.map((student, id) => renderItem(student, id, 1))}
      </div>
    </div>
  )
}

export default MemberPage
