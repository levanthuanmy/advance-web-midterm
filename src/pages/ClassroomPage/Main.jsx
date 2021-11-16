import emailjs from "emailjs-com"
import React, { useState } from "react"
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import {
  emailPattern,
  MAIL_API_KEY,
  MAIL_SERVICE_ID,
  MAIL_TEMPLATE_ID,
} from "../../config/constants"
import { patch } from "../../api"
import Cookies from "universal-cookie"

const Main = ({ resClassroom, isHost }) => {
  const [isToast, setIsToast] = useState(false)
  const [isShowEmailInput, setIsShowEmailInput] = useState(false)
  const [isShowDetailInfoModal, setIsShowDetailInfoModal] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isDisableInput, setIsDisableInput] = useState(true)
  const [toastMsg, setToastMsg] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm()

  const handleGenInviteLink = () => {
    const inviteLink =
      window?.location?.href + `/join?code=${resClassroom?.code}`
    navigator.clipboard.writeText(inviteLink)
    setToastMsg(
      "Đã lưu đường dẫn tham gia lớp học vào bộ nhớ đệm. Ctrl + C để dán."
    )
    setIsToast(true)
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

  const cookies = new Cookies()

  const patchClassroom = async (body) => {
    setIsSending(true)
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${cookies.get("token")}`,
    }

    const res = await patch(
      `/classrooms/edit/${resClassroom.code}`,
      {},
      body,
      headers
    )
    console.log("patchClassroom - res", res)
    setIsSending(false)
    setIsDisableInput(true)

    window?.location?.reload()
  }

  const onSubmitEmail = () => {
    const inviteLink =
      window?.location?.href + `/join?code=${resClassroom?.code}`
    !isSending && sendEmail(inviteLink, getValues("toEmail"))
    reset()
  }

  const onSubmitClassDetail = () => {
    const body = {
      name: getValues("className"),
      subject: getValues("classSubject"),
      description: getValues("classDescription"),
      themeColor: getValues("classThemeColor"),
      room: getValues("classRoom"),
      banner: getValues("classBanner"),
    }
    console.log("onSubmitClassDetail - body", body)

    !isSending && patchClassroom(body)
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

  const renderBanner = () => {
    // const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    //   <div
    //     className=""
    //     ref={ref}
    //     onClick={(e) => {
    //       e.preventDefault()
    //       onClick(e)
    //     }}
    //   >
    //     <i className="bi bi-gear-fill fs-3 text-white" />
    //   </div>
    // ))

    return (
      <div
        className="cus-classroom-page-banner w-100 d-flex py-3 px-4 justify-content-between"
        style={{
          backgroundImage: `url("${resClassroom?.banner}")`,
          backgroundColor: resClassroom?.themeColor || "gray",
        }}
      >
        <div className="h1 m-0 pb-1 text-white text-nowrap text-truncate align-self-end">
          {resClassroom?.name}
        </div>
        {isHost && (
          <div
            className="align-self-start cursor-pointer"
            onClick={() => setIsShowDetailInfoModal(true)}
          >
            <i className="bi bi-gear-fill fs-3 text-white" />

            {/* <Dropdown>
            <Dropdown.Toggle
              as={CustomToggle}
              id="dropdown-custom-components"
            ></Dropdown.Toggle>

            <Dropdown.Menu className="cus-rounded-dot75rem">
              <Dropdown.Item eventKey="1" className="text-secondary">
                <i className="bi bi-info-circle-fill me-2" /> Hiện chi tiết lớp
                học
              </Dropdown.Item>
              <Dropdown.Item eventKey="2" className="text-secondary">
                <i className="bi bi-pencil-square me-2" /> Chỉnh sửa chi tiết
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          </div>
        )}
      </div>
    )
  }

  const renderIncomingEvent = () => {
    return (
      <div className="cus-short-event-info border p-3">
        <div className="">Sắp đến hạn</div>
        <div className="fw-normal pt-3 text-muted">
          Tuyệt vời, không có bài tập nào sắp đến hạn!
        </div>
        <div
          className="pt-3 text-end cursor-pointer"
          style={{ color: resClassroom?.themeColor }}
        >
          Xem tất cả
        </div>
      </div>
    )
  }

  const renderClassroomCode = () => {
    return (
      <div className="cus-short-event-info border p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>Mã lớp</span>
          <div>
            <i className="bi bi-three-dots-vertical fs-4 cursor-pointer" />
          </div>
        </div>
        <div
          className="pt-3 fs-3 w-100 d-flex align-items-center"
          style={{ color: resClassroom?.themeColor }}
        >
          <div className="w-100 text-truncate">{resClassroom?.code}</div>
          <i
            className="bi bi-clipboard cursor-pointer"
            onClick={() => handleGenInviteLink()}
          />
        </div>
        <div
          className="text-end pt-3 cursor-pointer"
          style={{ color: resClassroom?.themeColor }}
          onClick={() => setIsShowEmailInput(true)}
        >
          Gửi lời mời đến email
        </div>
      </div>
    )
  }

  const renderEmailInputModal = () => (
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

  const renderDetailInfoClassModal = () => {
    const renderDetailInfo = () => (
      <Form className="" onSubmit={handleSubmit(onSubmitClassDetail)}>
        <Form.Group className="p-3">
          <Form.Label>Tên lớp</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled={isDisableInput}
            defaultValue={resClassroom?.name}
            {...register("className")}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>ID</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled
            defaultValue={resClassroom?._id}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>Mã mời</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled
            defaultValue={resClassroom?.code}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>Môn học</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled={isDisableInput}
            defaultValue={resClassroom?.subject}
            {...register("classSubject")}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled={isDisableInput}
            defaultValue={resClassroom?.description}
            {...register("classDescription")}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>Phòng học</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled={isDisableInput}
            defaultValue={resClassroom?.room}
            {...register("classRoom")}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>Màu chủ đề</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3 w-100"
            type="color"
            disabled={isDisableInput}
            defaultValue={resClassroom?.themeColor}
            {...register("classThemeColor")}
          />
        </Form.Group>
        <Form.Group className="p-3 pt-0">
          <Form.Label>Ảnh bìa</Form.Label>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            disabled={isDisableInput}
            defaultValue={resClassroom?.banner}
            {...register("classBanner")}
          />
        </Form.Group>
        <Modal.Footer>
          {isSending && (
            <Spinner size="sm" variant="secondary" animation="border" />
          )}
          <Button
            variant="secondary"
            onClick={() => setIsDisableInput(!isDisableInput)}
          >
            Chỉnh sửa thông tin
          </Button>
          <Button
            variant="primary"
            disabled={isDisableInput}
            onClick={() => onSubmitClassDetail()}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    )

    const onHideModal = () => {
      setIsShowDetailInfoModal(false)
      setIsDisableInput(true)
      reset()
    }

    return (
      <Modal
        show={isShowDetailInfoModal}
        onHide={() => onHideModal()}
        size=""
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thông tin chi tiết của lớp học
          </Modal.Title>
        </Modal.Header>

        {renderDetailInfo()}
      </Modal>
    )
  }

  return (
    <div>
      {renderDetailInfoClassModal()}
      {renderEmailInputModal()}
      {renderToast()}
      {renderBanner()}
      <div className="w-100 my-4">
        <Row className="m-0">
          <Col sm="12" md="auto" className="p-0 me-3 mb-3">
            {isHost && renderClassroomCode()}

            {renderIncomingEvent()}
          </Col>

          <Col className="p-0">
            <div
              className="border"
              style={{ borderRadius: ".5rem", height: "100rem" }}
            ></div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Main
