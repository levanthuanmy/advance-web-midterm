import React, { useState } from "react"
import { post } from "../api"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import CustomSpinner from "./CustomSpinner"
import Cookies from "universal-cookie/es6"

const HandleAdminLogin = ({ show, onHide }) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const cookies = new Cookies()

  const onAdminLogin = async (data) => {
    try {
      setIsLoading(true)

      const res = await post(`/admin/login`, null, {}, data)

      console.log("onAdminLogin - res", res)
      storeUserInfo(res?.admin)
      cookies.set("token", res?.token)
    } catch (error) {
      console.log("onAdminLogin - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const storeUserInfo = (res) => {
    const localStorage = window?.localStorage
    localStorage?.setItem("user-info", JSON.stringify(res))
    window.location.reload()
  }

  const onSubmit = (data) => {
    console.log("onSubmit - data", data)
    onAdminLogin(data)
  }

  const renderSignInForm = () => {
    return (
      <>
        <Form.Group>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            placeholder="Tài khoản"
            {...register("account", {
              required: "Bạn cần tài khoản",
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
            })}
          />
          {errors.password && (
            <small className="text-danger">{errors.password?.message}</small>
          )}
        </Form.Group>
      </>
    )
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      centered
      keyboard={false}
      className="cus-bg-special-pattern"
    >
      <div className="w-100 cus-title-login-modal text-white text-center h2 m-0 d-flex flex-column justify-content-end align-items-center">
        <div className="mb-3">
          Chào mừng đến với <strong>My Classroom</strong>
        </div>
        <small className="fs-6 pb-3">Đăng nhập với quyền Quản trị viên</small>
      </div>

      <Modal.Body>
        <Form className="px-sm-5 py-sm-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="h4 mb-4 user-select-none">
            Đăng nhập Quản trị viên
          </div>

          {renderSignInForm()}

          <div className="d-flex justify-content-end">
            <Button
              disabled={isLoading}
              type="submit"
              onClick={() => handleSubmit(onSubmit)}
              className="mt-4 rounded-circle cus-login-btn d-flex justify-content-center align-items-center"
            >
              <i className="bi bi-arrow-right-short fs-1" />
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {isLoading && (
        <div className="position-absolute top-0 left-0 bg-dark bg-opacity-50 cus-rounded-1dot5rem w-100 h-100">
          <CustomSpinner />
        </div>
      )}
    </Modal>
  )
}

export default HandleAdminLogin
