import React, { useState } from "react"
import { Col, Row, Toast, ToastContainer, Dropdown } from "react-bootstrap"

const Main = ({ resClassroom, isHost }) => {
  const [isToast, setIsToast] = useState(false)

  const handleGenInviteLink = () => {
    const inviteLink =
      window?.location?.href + `/join?code=${resClassroom?.code}`
    navigator.clipboard.writeText(inviteLink)
    setIsToast(true)
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
            <strong className="me-auto">
              Đã lưu đường dẫn tham gia lớp học vào bộ nhớ đệm. Ctrl + C để dán.
            </strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>
    )
  }

  const renderBanner = () => {
    const CustomToggle = React.forwardRef(({ onClick }, ref) => (
      <div
        className=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault()
          onClick(e)
        }}
      >
        <i className="bi bi-gear-fill fs-3 text-white" />
      </div>
    ))

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
        <div className="align-self-start cursor-pointer">
          <Dropdown>
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
          </Dropdown>
        </div>
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
      </div>
    )
  }

  return (
    <div>
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
