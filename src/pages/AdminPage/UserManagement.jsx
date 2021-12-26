import React from "react"
import { Button, Col, Form, Row, Table } from "react-bootstrap"

const UserManagement = () => {
  return (
    <>
      <div className="mx-5">
        <div className="fs-2 mb-5">Quản lý người dùng</div>
        <Form>
          <Row>
            <Col xs="12" sm="6" lg="3">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" placeholder="Tìm ID" />
              </Form.Group>
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mã số</Form.Label>
                <Form.Control type="text" placeholder="Tìm mã số" />
              </Form.Group>
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Tên</Form.Label>
                <Form.Control type="text" placeholder="Tìm tên" />
              </Form.Group>
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Tìm email" />
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="rounded-circle border-0"
            style={{ height: 50, width: 50 }}
          >
            <i class="bi bi-search" />
          </Button>
        </Form>
      </div>

      <div id="listUsers" className="p-5 panel overflow-auto">
        <Table borderless hover className="shadow-sm">
          <tbody className="rounded-3">
            <tr className="bg-light fs-5 fw-bold">
              <td className="px-3 ps-5">ID</td>
              <td className="px-3">Mã số</td>
              <td className="px-3">Tên đầy đủ</td>
              <td className="px-3 pe-5">Hành động</td>
            </tr>
            {/* {allStudents?.map((student, id) => ( */}
            <tr>
              <td className="px-3 ps-5">e2jd0921jdưkqjd092</td>
              <td className="px-3">18127156</td>
              <td className="px-3">Le Van Thuan My</td>
              <td className="px-3 pe-5">
                <i className="bi bi-slash-circle-fill fs-3 text-secondary me-3 cursor-pointer" />
                <i className="bi bi-pencil-fill fs-3 text-primary cursor-pointer"/>
              </td>
            </tr>
            
            {/* ))} */}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default UserManagement
