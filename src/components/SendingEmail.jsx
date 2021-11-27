import React, { useState } from "react"
import { Form, Modal, Spinner, Button } from "react-bootstrap"
import { useForm } from "react-hook-form"
import {
  emailPattern,
  MAIL_API_KEY,
  MAIL_SERVICE_ID,
  MAIL_TEMPLATE_ID,
} from "../config/constants"
import emailjs from "emailjs-com"
import { simpleEncode } from "../config/helper"

const SendingEmail = ({
  classRoomCode,
  setIsToast,
  setToastMsg,
  isShowEmailInput,
  setIsShowEmailInput,
  inviteTeacher = false,
}) => {
  const [isSending, setIsSending] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm()

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
      setIsSending(false)

      console.log("sendEmail - error", error)
    }
  }

  const onSubmitEmail = () => {
    const inviteLink = inviteTeacher
      ? window?.location?.href +
        `/join?code=${classRoomCode}&email=${simpleEncode(
          getValues("toEmail")
        )}`
      : window?.location?.href + `/join?code=${classRoomCode}`

    !isSending && sendEmail(inviteLink, getValues("toEmail"))
    reset()
  }

  return (
    <Modal
      show={isShowEmailInput}
      onHide={() => setIsShowEmailInput(false)}
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
          <Button
            variant="primary"
            type="submit"
            disabled={isSending}
            onClick={() => onSubmitEmail()}
          >
            Gửi
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SendingEmail
