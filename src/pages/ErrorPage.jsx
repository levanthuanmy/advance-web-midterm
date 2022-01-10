import {Button} from "react-bootstrap"
import React from "react"
import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import Cookies from "universal-cookie/es6"

const ErrorPage = () => {
  const cookies = new Cookies()
  const navigate = useNavigate()
  
  useEffect(() => {
    cookies.remove("token")
    window?.sessionStorage?.removeItem("access_token")
    window?.localStorage?.clear()
  }, [])

  return (
    <div
      className="position-fixed top-0 left-0 vh-100 vw-100 bg-white d-flex justify-content-center align-items-center flex-column"
      style={{ zIndex: 9999 }}
    >
      <div>Đã có lỗi xảy ra</div>
        <div>
         Vui lòng liên hệ{" "}
          <a href="mailto:myclassroom@gmail.com">myclassroom@gmail.com</a> để biết
          thêm thông tin chi tiết.
        </div>

        <Button className="mt-3" onClick={() => navigate(`/`)}>
        Về trang chủ
        </Button>
    </div>
  )
}

export default ErrorPage
