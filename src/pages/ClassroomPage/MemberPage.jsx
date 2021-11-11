import React from "react"
import { Image } from "react-bootstrap"

const MemberPage = ({ themeColor }) => {
  // const renderTeacherList = () => {
  //   return
  // }
  return (
    <div className="w-100">
      <div className="mb-5">
        <div className="border-bottom px-3 py-4 d-flex" style={{}}>
          <div className="h2 mb-0">Giáo viên</div>
          <div className="h6 mb-0 m-auto me-0">2 người</div>
        </div>
        <div className="d-flex border-bottom p-3 align-items-center">
          <Image
            src={`/images/default-user-${
              Math.floor(Math.random() * 2) ? "wo" : ""
            }man.png`}
            fluid
            className="rounded-circle"
            style={{ width: "3rem", height: "3rem" }}
          />
          <div className="h6 ps-3 small m-0">Nguyễn Văn AAA</div>
        </div>
      </div>

      <div>
      <div className="border-bottom px-3 py-4 d-flex" style={{}}>
          <div className="h2 mb-0">Học viên</div>
          <div className="h6 mb-0 m-auto me-0">2 người</div>
        </div>
        <div className="d-flex border-bottom p-3 align-items-center">
          <Image
            src={`/images/default-user-${
              Math.floor(Math.random() * 2) ? "wo" : ""
            }man.png`}
            fluid
            className="rounded-circle"
            style={{ width: "3rem", height: "3rem" }}
          />
          <div className="h6 ps-3 small m-0">Nguyễn Văn AAA</div>
        </div>
      </div>
    </div>
  )
}

export default MemberPage
