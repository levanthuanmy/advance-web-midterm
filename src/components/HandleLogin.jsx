import React, { useState, useEffect } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { post } from "../api"
import { googleLoginUrl } from "../config/GoogleAuth"
import * as queryString from "query-string"
import { getAccessTokenFromCode, getGoogleUserInfo } from "../config/GoogleAuth"
import { useNavigate } from "react-router-dom"
import { emailPattern, minLengthPassword } from "../config/constants"
import CustomSpinner from "../components/CustomSpinner"

const HandleLogin = ({ isShowLogin, setIsShowLogin }) => {
  const [loginMode, setLoginMode] = useState(0)
  const [googleCode, setGoogleCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const cookies = new Cookies()
  const navigate = useNavigate()

  const userLogin = async (body) => {
    try {
      setIsLoading(true)

      const res = await post("/users/login", "", {}, body)

      console.log("Login success")

      storeUserInfo(res?.user)
      cookies.set("token", res?.token)

      setIsLoading(false)
      setIsShowLogin(false)

      window?.location?.reload()
    } catch (error) {
      setIsLoading(false)
      alert(error)
      console.log("userLogin - error", error)
    }
  }

  const userLoginWithGoogle = async (body) => {
    const res = await post("/users/loginWithGoogle", "", {}, body)

    console.log("Login success")

    cookies.set("token", res?.token)
    storeUserInfo(res?.user)

    setIsShowLogin(false)
    navigate("/")

    window?.location?.reload()
  }

  const userSignUp = async (body) => {
    try {
      setIsLoading(true)

      const res = await post("/users", "", {}, body)
      console.log("userSignUp - res", res)

      storeUserInfo(res?.user)
      cookies.set("token", res?.token)

      setIsLoading(true)
      setIsShowLogin(false)

      window?.location?.reload()
    } catch (error) {
      setIsLoading(false)
      alert(error)
      console.log("userSignUp - error", error)
    }
  }

  const storeUserInfo = (res) => {
    const localStorage = window?.localStorage
    localStorage?.setItem("user-info", JSON.stringify(res))
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

  //use for Google login
  useEffect(() => {
    const urlParams = queryString.parse(window?.location?.search)
    if (urlParams?.error || urlParams?.code === undefined) {
      console.log(`An error occurred: ${urlParams?.error}`)
    } else {
      setGoogleCode(urlParams?.code)
      console.log(`The code is: ${urlParams?.code}`)
      loginWithGoogle(urlParams?.code)
    }
  }, [])

  const loginWithGoogle = async (code) => {
    try {
      const token = await getAccessTokenFromCode(code)
      console.log("loginWithGoogle token", token)
      const userInfo = await getGoogleUserInfo(token)
      console.log("loginWithGoogle userInfo", userInfo)

      const body = {
        name: userInfo.name,
        email: userInfo.email,
        id: userInfo.id,
        avatar: userInfo.picture,
      }
      userLoginWithGoogle(body)
    } catch (error) {
      console.log("loginWithGoogle - error", error)
    }
  }

  const renderSignInForm = () => {
    return (
      <>
        <Form.Group>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            placeholder="Email"
            {...register("signInEmail", {
              required: "Bạn cần nhập email",
              pattern: emailPattern,
            })}
          />
          {errors.signInEmail && (
            <small className="text-danger">{errors.signInEmail?.message}</small>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3 mt-3"
            type="password"
            placeholder="Mật khẩu"
            {...register("signInPassword", {
              required: "Bạn cần nhập mật khẩu",
              minLength: minLengthPassword,
            })}
          />
          {errors.signInPassword && (
            <small className="text-danger">
              {errors.signInPassword?.message}
            </small>
          )}
        </Form.Group>
      </>
    )
  }

  const renderSignUpForm = () => {
    return (
      <>
        <Form.Group>
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="email"
            placeholder="Email"
            {...register("signUpEmail", {
              required: "Bạn cần nhập email",
              pattern: emailPattern,
            })}
          />
          {errors.signUpEmail && (
            <small className="text-danger">{errors.signUpEmail?.message}</small>
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
            {...register("signUpPassword", {
              required: "Bạn cần nhập mật khẩu",
              minLength: minLengthPassword,
            })}
          />
          {errors.signUpPassword && (
            <small className="text-danger">
              {errors.signUpPassword?.message}
            </small>
          )}
        </Form.Group>
      </>
    )
  }

  return (
    <Modal
      show={isShowLogin}
      onHide={() => setIsShowLogin(false)}
      backdrop="static"
      centered
      keyboard={false}
      className="cus-bg-special-pattern"
    >
      <div className="w-100 cus-title-login-modal text-white text-center h2 m-0 d-flex flex-column justify-content-end align-items-center">
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

          {loginMode ? renderSignUpForm() : renderSignInForm()}

          <div className="d-flex justify-content-between">
            <Button
              disabled={isLoading}
              href={googleLoginUrl}
              className="mt-4 rounded-circle cus-login-btn d-inline-flex justify-content-center align-items-center"
            >
              <i className="bi bi-google fs-3" />
            </Button>

            <Button
              disabled={isLoading}
              type="submit"
              onClick={() => handleSubmit(onSubmit)}
              className="mt-4 rounded-circle cus-login-btn d-inline-flex justify-content-center align-items-center"
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

export default HandleLogin
