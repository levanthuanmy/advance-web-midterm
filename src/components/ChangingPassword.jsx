import React, { useState } from "react"
import { Button, Form, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import { post } from "../api"
import { minLengthPassword } from "../config/constants"

const ChangingPassword = ({ email, handleBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const cookies = new Cookies()
  const navigate = useNavigate()

  const changePassword = async (body) => {
    try {
      setIsLoading(true)

      const res = await post(`/users/reset-password`, null, {}, body)

      console.log("changePassword - res", res)
      alert(res)

      userLogin({ email, password: body?.password })
    } catch (error) {
      console.log("changePassword - error", error)
      alert(error?.response?.data)
    } finally {
      setIsLoading(false)
    }
  }

  const userLogin = async (body) => {
    try {
      setIsLoading(true)

      const res = await post("/users/login", "", {}, body)

      console.log("Login success")

      storeUserInfo(res?.user)
      cookies.set("token", res?.token)

      setIsLoading(false)

      navigate("/")
      window?.location.reload()
    } catch (error) {
      setIsLoading(false)
      alert(error)
      console.log("userLogin - error", error)
    }
  }

  const storeUserInfo = (res) => {
    const localStorage = window?.localStorage
    localStorage?.setItem("user-info", JSON.stringify(res))
  }

  const onSubmit = (data) => {
    data = { ...data, email }
    console.log("onSubmit - data", data)
    changePassword(data)
  }

  return (
    <Form
      className="position-relative cus-rounded-1dot5rem p-3 bg-white shadow-lg w-100"
      style={{ maxWidth: "30rem" }}
    >
      <div className="h2 my-3">
        <i
          className="bi bi-arrow-left-circle me-3 cursor-pointer"
          onClick={handleBack}
        />
        Đổi mật khẩu
      </div>
      <div className="text-secondary my-3 small">
        Vui lòng nhập mã xác minh mà bạn đã nhập được trong email, sau đó nhập
        mật khẩu mới cho tài khoản của bạn.
      </div>
      <Form.Group>
        <Form.Control
          className="cus-rounded-dot75rem py-2 px-3"
          type="text"
          placeholder="Mã xác minh"
          {...register("passCode", {
            required: "Bạn cần nhập mã xác minh",
          })}
        />
        {errors.passCode && (
          <small className="text-danger">{errors.passCode?.message}</small>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Control
          className="cus-rounded-dot75rem py-2 px-3 mt-3"
          type="password"
          placeholder="Mật khẩu mới"
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
        disabled={isLoading}
        type="submit"
        size="lg"
        className="cus-rounded-dot75rem float-end mt-3"
        onClick={handleSubmit(onSubmit)}
      >
        {isLoading && (
          <Spinner
            animation="border"
            variant="light"
            size="sm"
            className="me-2"
          />
        )}
        Đổi mật khẩu
      </Button>
    </Form>
  )
}

export default ChangingPassword
