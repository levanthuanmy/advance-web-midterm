import React from "react"

const ErrorPage = () => {
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
    </div>
  )
}

export default ErrorPage
