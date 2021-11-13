import React from "react"
import { Col, Row } from "react-bootstrap"

const Main = ({ resClassroom }) => {
  return (
    <div>
      <div
        className="cus-classroom-page-banner w-100 d-flex align-items-end py-3 px-4"
        style={{
          backgroundImage: `url("${resClassroom?.banner}")`,
          backgroundColor: resClassroom?.themeColor || "gray",
        }}
      >
        <div className="h1 m-0 pb-1 text-white text-nowrap text-truncate">
          {resClassroom?.name}
        </div>
      </div>
      <div className="w-100 my-4">
        <Row className="m-0">
          <Col sm="12" md="auto" className="p-0 me-4">
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
