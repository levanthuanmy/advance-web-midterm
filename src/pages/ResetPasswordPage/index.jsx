import React, { useState } from "react"
import { Button, Form, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { post } from "../../api"
import ChangingPassword from "../../components/ChangingPassword"
import { emailPattern } from "../../config/constants"

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [isShow, setIsShow] = useState(false)

  const getCode = async (body) => {
    try {
      setIsLoading(true)

      const res = await post(`/users/forgot-password`, null, {}, body)

      console.log("getCode - res", res)
      alert(res)
      setIsShow(true)
    } catch (error) {
      console.log("getCode - error", error)
      alert(error?.response?.data)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    getCode(data)
  }

  return (
    <div
      className="position-fixed top-0 z4 vw-100 bg-light d-flex justify-content-center align-items-center"
      style={{ zIndex: 999, minHeight: "100vh", left: "0" }}
    >
      {isShow ? (
        <ChangingPassword
          email={getValues("email")}
          handleBack={() => setIsShow(false)}
        />
      ) : (
        <Form
          className="position-relative cus-rounded-1dot5rem p-3 bg-white shadow-lg w-100"
          style={{ maxWidth: "30rem" }}
        >
          <div className="h2 my-3">Đặt lại mật khẩu</div>
          <div className="text-secondary my-3 small">
            Vui lòng nhập email, chúng tôi sẽ gửi mã xác minh đến email của bạn
            và đi đến bước đổi mật khẩu.
            <br />
            <span className="fst-italic">
              Lưu ý: Mã xác minh sẽ hết hạn sau 3 phút.
            </span>
          </div>
          <Form.Group>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="email"
              placeholder="Email của bạn"
              {...register("email", {
                required: "Bạn cần nhập email",
                pattern: emailPattern,
              })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email?.message}</small>
            )}
          </Form.Group>

          <div className="mt-4 float-start text-primary cursor-pointer">
            Về trang chủ
          </div>

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
            Gửi
          </Button>
        </Form>
      )}
    </div>
  )
}

export default ResetPasswordPage
