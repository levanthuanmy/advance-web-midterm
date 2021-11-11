import React from "react"
import { Col, Row, Spinner } from "react-bootstrap"
import ClassroomCard from "./ClassroomCard"

const ClassroomList = ({ isLoading, resClassrooms }) => {
  return (
    <Row className="w-100 m-0 pt-4 ps-4">
      {isLoading ? (
        <div className="mt-5 d-flex justify-content-center">
          <div className="bg-white shadow rounded-circle d-flex justify-content-center align-items-center cus-spinner">
            <Spinner variant="secondary" animation="border" />
          </div>
        </div>
      ) : (
        resClassrooms?.map((item, id) => (
          <Col key={id} xs="auto" className="p-0 pe-4 pb-4">
            <ClassroomCard classroom={item} />
          </Col>
        ))
      )}
    </Row>
  )
}

export default ClassroomList
