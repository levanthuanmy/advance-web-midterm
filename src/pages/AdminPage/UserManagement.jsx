import React, { useEffect } from "react"
import { get } from "../../api"
import { Button, Col, Form, Row, Table } from "react-bootstrap"
import { useState } from "react"
import Cookies from "universal-cookie/es6"

const UserManagement = () => {
  const [token] = useState(new Cookies().get("token"))
  const [resUserList, setResUserList] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const getUserList = async () => {
    try {
      setIsLoading(true)

      const res = await get(`/admin/list-user?sort=desc`, token)

      setResUserList(res)
    } catch (error) {
      console.log("getUserList - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getUserList()
    }
  }, [token])

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
              <td className="px-3">Mã số</td>
              <td className="px-3">Tên đầy đủ</td>
              <td className="px-3">Email</td>
              <td className="px-3">Trạng thái</td>
              <td className="px-3">Hành động</td>
            </tr>
            {resUserList?.map((user, id) => {
              const isActive = user?.status === "active"
              return (
                <tr key={id}>
                  <td className="px-3 text-truncate">{user?.studentId}</td>
                  <td className="px-3 text-truncate">{user?.name}</td>
                  <td className="px-3 text-truncate">{user?.email}</td>
                  <td
                    className={`px-3 text-uppercase fw-bold small ${
                      isActive ? `text-success` : `text-danger`
                    }`}
                  >
                    {user?.status}
                  </td>
                  <td className="px-3">
                    <i
                      className={`bi bi-slash-circle-fill fs-3 ${
                        isActive ? `text-primary` : `text-secondary`
                      } me-3 cursor-pointer`}
                    />
                    <i className="bi bi-pencil-fill fs-3 text-primary cursor-pointer" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default UserManagement
