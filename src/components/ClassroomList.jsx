import React from "react"
import { Col, Row } from "react-bootstrap"
import ClassroomCard from "./ClassroomCard"
import CustomSpinner from "./CustomSpinner"

const ClassroomList = ({ isLoading, resClassrooms }) => {
  return (
    <Row className="w-100 m-0 pt-4 ps-4">
      {isLoading ? (
        <CustomSpinner />
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
