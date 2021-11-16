import React, { useEffect, useState } from "react"
import {
  Col,
  Form,
  Image,
  Row,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { get, patch, post } from "../api"
import CustomSpinner from "../components/CustomSpinner"

const UserInformationPage = () => {
  const [resUserInfo, setResUserInfo] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const [isDisableEmail, setIsDisableEmail] = useState(true)
  const [isDisableSID, setIsDisableSID] = useState(true)
  const [isDisablePass, setIsDisablePass] = useState(true)
  const [isDisableName, setIsDisableName] = useState(true)

  const [isEditAvatar, setIsEditAvatar] = useState(false)

  const cookies = new Cookies()

  const { register, setValue, getValues } = useForm()

  const storeUserInfo = (res) => {
    const localStorage = window?.localStorage
    localStorage?.setItem("user-info", JSON.stringify(res))
  }

  const getUserInfo = async () => {
    try {
      !isLoading && setIsLoading(true)

      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${cookies.get("token")}`,
      }

      const res = await get(`/users/me`, {}, headers)
      console.log("getUserInfo - res", res)

      setResUserInfo(res)
      storeUserInfo(res)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)

      console.log("getUserInfo - error", error)
    }
  }

  const editUserInfo = async (body) => {
    try {
      !isLoading && setIsLoading(true)

      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${cookies.get("token")}`,
      }

      const res = await patch(`/users/me`, {}, body, headers)
      console.log("editUserInfo - res", res)

      setResUserInfo(res)
      storeUserInfo(res)

      window?.location?.reload()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)

      console.log("editUserInfo - error", error)
    }
  }

  const editAvatar = async (body) => {
    try {
      const headers = {
        "Content-Type": "",
        Authorization: `Bearer ${cookies.get("token")}`,
      }

      const res = await post(`/users/me/avatar`, {}, body, headers)
      console.log("editAvatar - res", res)
    } catch (error) {
      console.log("editAvatar - error", error)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  if (isLoading) return <CustomSpinner />

  return (
    <div className="px-4 w-100 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: "60rem" }}>
        <div className="h3 text-secondary">Thông tin cá nhân</div>
        <Row className="m-0 pt-4">
          <Col xs="12" md="auto" className="p-0">
            <Image
              className="bg-white cus-rounded-dot75rem"
              style={{ width: "15rem", height: "15rem" }}
              src={resUserInfo?.avatar || `/images/avatar.png`}
              fluid
            />
            {/* <div className="pt-3">
              <Button onClick={() => setIsEditAvatar(true)}>Sửa Avatar</Button>
              {isEditAvatar && (
                <>
                  <Form.Control
                    className="mt-3"
                    type="file"
                    size="sm"
                    placeholder="Chọn ảnh"
                    {...register("avatar")}
                  />
                  <Button
                    onClick={() => {
                      console.log(getValues("avatar"))
                      editAvatar({ "avatar": getValues("avatar")[0] })
                    }}
                  >
                    Lưu
                  </Button>
                </>
              )}
            </div> */}
          </Col>
          <Col className="p-0 pt-4 pt-md-0 px-0 px-md-5">
            <Form className="w-100">
              <Form.Group className="p-0">
                <Form.Label>Tên</Form.Label>
                <InputGroup>
                  <FormControl
                    aria-describedby="basic-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    defaultValue={resUserInfo?.name}
                    disabled={isDisableName}
                    {...register("name")}
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    onClick={() => {
                      if (isDisableName) {
                        setIsDisableName(false)
                      } else {
                        editUserInfo({ name: getValues("name") })
                        setIsDisableName(true)
                      }
                    }}
                  >
                    {isDisableName ? "Sửa" : "Lưu"}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="pt-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <FormControl
                    aria-describedby="basic-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    disabled={isDisableEmail}
                    defaultValue={resUserInfo?.email}
                    {...register("email")}
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    onClick={() => {
                      if (isDisableEmail) {
                        setIsDisableEmail(false)
                      } else {
                        editUserInfo({ email: getValues("email") })
                        setIsDisableEmail(true)
                      }
                    }}
                  >
                    {isDisableEmail ? "Sửa" : "Lưu"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="pt-3">
                <Form.Label>Mã học viên</Form.Label>
                <InputGroup>
                  <FormControl
                    aria-describedby="basic-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    disabled={isDisableSID}
                    defaultValue={resUserInfo?.studentId}
                    {...register("studentId")}
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    onClick={() => {
                      if (isDisableSID) {
                        setIsDisableSID(false)
                      } else {
                        editUserInfo({ studentId: getValues("studentId") })
                        setIsDisableSID(true)
                      }
                    }}
                  >
                    {isDisableSID ? "Sửa" : "Lưu"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="pt-3">
                <Form.Label>Đổi mật khẩu</Form.Label>
                <InputGroup>
                  <FormControl
                    type="password"
                    aria-describedby="basic-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    disabled={isDisablePass}
                    {...register("password")}
                  />
                  <Button
                    variant="outline-secondary"
                    id="button-addon2"
                    className="cus-rounded-dot75rem py-2 px-3"
                    onClick={() => {
                      if (isDisablePass) {
                        setIsDisablePass(false)
                      } else {
                        editUserInfo({ password: getValues("password") })
                        setValue("password", null)
                        setIsDisablePass(true)
                      }
                    }}
                  >
                    {isDisablePass ? "Sửa" : "Lưu"}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default UserInformationPage
