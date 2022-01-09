import React, { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie/es6"
import { post } from "../api"
import { ADMIN_SECRET_CODE, minLengthPassword } from "../config/constants"

const ModalCreateAdmin = ({ show, onHide, setIsReGet }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [token] = useState(new Cookies().get("token"))

  const createAdmin = async (data) => {
    try {
      await post(`/admin`, token, {}, data)
      setIsReGet(true)
    } catch (error) {
      console.log("createAdmin - error", error)
    } finally {
      reset()
      onHide()
    }
  }

  const onSubmit = (data) => {
    data = { ...data, secretCode: ADMIN_SECRET_CODE }
    createAdmin(data)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName="cus-rounded-1dot5rem"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Tạo mới quản trị viên
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="m-3">
        <Form>
          <Form.Group>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="text"
              placeholder="Tên"
              {...register("name", {
                required: "Bạn cần nhập tên",
              })}
            />
            {errors.name && (
              <small className="text-danger">{errors.name?.message}</small>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3 mt-3"
              type="text"
              placeholder="Tài khoản"
              {...register("account", {
                required: "Bạn cần nhập tài khoản",
              })}
            />
            {errors.account && (
              <small className="text-danger">{errors.account?.message}</small>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3 mt-3"
              type="password"
              placeholder="Mật khẩu"
              {...register("password", {
                required: "Bạn cần nhập mật khẩu",
                minLength: minLengthPassword,
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password?.message}</small>
            )}
          </Form.Group>

          <Button
            className="cus-rounded-dot75rem mt-3 float-end"
            onClick={handleSubmit(onSubmit)}
          >
            Tạo
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalCreateAdmin
