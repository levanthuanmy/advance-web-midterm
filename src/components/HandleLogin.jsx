import React, { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useForm } from "react-hook-form"
import { post } from "../api"

const HandleLogin = ({ isShowLogin, setIsShowLogin }) => {
  const [loginMode, setLoginMode] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(["token"])

  const userLogin = async (body) => {
    const res = await post("/users/login", {}, JSON.stringify(body))
    console.log("Login success")
    setCookie("token", res?.token)
  }

  const userSignUp = async (body) => {
    const res = await post("/users", {}, JSON.stringify(body))
    console.log("Sign up success")
    setCookie("token", res?.token)
  }

  const onSubmit = (data) => {
    if (loginMode) {
      const body = {
        name: data.signUpName,
        email: data.signUpEmail,
        password: data.signUpPassword,
      }
      userSignUp(body)
    } else {
      const body = { email: data.signInEmail, password: data.signInPassword }
      userLogin(body)
    }
  }

  return (
    <Modal
      show={isShowLogin}
      onHide={() => setIsShowLogin(false)}
      backdrop="static"
      centered
      className="cus-bg-special-pattern"
    >
      <div className="w-100 cus-title-login-modal text-white h2 m-0 d-flex flex-column justify-content-end align-items-center">
        <div className="mb-3">
          Chào mừng đến với <strong>My Classroom</strong>
        </div>
        <small className="fs-6 pb-3">Đăng nhập hoặc đăng kí để tiếp tục</small>
      </div>

      <Modal.Body>
        <Form className="px-sm-5 py-sm-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="h4 mb-4 d-flex justify-content-between text-muted user-select-none">
            <div
              className={`cursor-pointer ${!loginMode && "text-black"}`}
              onClick={() => {
                setLoginMode(0)
                reset()
              }}
            >
              Đăng nhập
            </div>

            <div
              className={`cursor-pointer ${loginMode && "text-black"}`}
              onClick={() => {
                setLoginMode(1)
                reset()
              }}
            >
              Đăng kí
            </div>
          </div>

          {loginMode ? (
            <>
              <Form.Group>
                <Form.Control
                  className="cus-rounded-dot75rem py-2 px-3"
                  type="text"
                  placeholder="Email"
                  {...register("signUpEmail", { required: true })}
                />
                {errors.signUpEmail && (
                  <small className="text-danger">Bạn cần nhập email</small>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Control
                  className="cus-rounded-dot75rem py-2 px-3 mt-3"
                  type="text"
                  placeholder="Tên đầy đủ"
                  {...register("signUpName", { required: true })}
                />
                {errors.signUpName && (
                  <small className="text-danger">Bạn cần nhập tên</small>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Control
                  className="cus-rounded-dot75rem py-2 px-3 mt-3"
                  type="password"
                  placeholder="Mật khẩu"
                  {...register("signUpPassword", { required: true })}
                />
                {errors.signUpPassword && (
                  <small className="text-danger">Bạn cần nhập mật khẩu</small>
                )}
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group>
                <Form.Control
                  className="cus-rounded-dot75rem py-2 px-3"
                  type="text"
                  placeholder="Email"
                  {...register("signInEmail", { required: true })}
                />
                {errors.signInEmail && (
                  <small className="text-danger">Bạn cần nhập email</small>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Control
                  className="cus-rounded-dot75rem py-2 px-3 mt-3"
                  type="password"
                  placeholder="Mật khẩu"
                  {...register("signInPassword", { required: true })}
                />
                {errors.signInPassword && (
                  <small className="text-danger">Bạn cần nhập mật khẩu</small>
                )}
              </Form.Group>
            </>
          )}

          <div className="d-flex justify-content-end">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="mt-4 rounded-circle cus-login-btn d-inline-flex justify-content-center align-items-center"
            >
              <i className="bi bi-arrow-right-short fs-1" />
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default HandleLogin
