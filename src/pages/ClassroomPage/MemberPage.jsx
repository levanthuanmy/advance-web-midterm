import React, { useContext, useState } from "react"
import { Image, Toast, ToastContainer } from "react-bootstrap"
import { ThemeColorContext } from "."
import SendingEmail from "../../components/SendingEmail"

const MemberPage = ({ students, teachers, resClassroom }) => {
  const [isShowEmailInput, setIsShowEmailInput] = useState(false)
  const [isToast, setIsToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const [inviteTeacher, setInviteTeacher] = useState(false)

  const themeColorContext = useContext(ThemeColorContext)

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

      <SendingEmail
        classRoomCode={resClassroom?.code}
        isShowEmailInput={isShowEmailInput}
        setIsShowEmailInput={setIsShowEmailInput}
        setIsToast={setIsToast}
        setToastMsg={setToastMsg}
        inviteTeacher={inviteTeacher}
      />

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
              onClick={() => {
                setIsShowEmailInput(true)
                setInviteTeacher(true)
              }}
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
            <i
              className="ms-3 fs-3 cursor-pointer bi bi-person-plus-fill"
              onClick={() => {
                setIsShowEmailInput(true)
                setInviteTeacher(false)
              }}
            />
          </div>
        </div>
        {students?.map((student, id) => renderItem(student, id, 1))}
      </div>
    </div>
  )
}

export default MemberPage
