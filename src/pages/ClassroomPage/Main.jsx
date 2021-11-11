import React from "react"
import { Col, Row } from "react-bootstrap"

const Main = ({ resClassroom }) => {
  return (
    <div>
      <div
        className="w-100 d-flex align-items-end py-3 px-4"
        style={{
          transition: "all linear .3s",
          borderRadius: ".75rem",
          height: "15rem",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          boxShadow: "inset 0 0 0 2000px rgba(64, 64, 64, 0.3)",
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
            <div
              className="border p-3"
              style={{
                width: "12rem",
                borderRadius: ".5rem",
                fontSize: ".875rem",
                fontWeight: "600",
              }}
            >
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
