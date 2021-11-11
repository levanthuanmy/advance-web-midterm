import React from "react"

const LeftMenu = ({ showMenu }) => {
  return (
    <div
      className="cus-menu-left"
      style={
        showMenu
          ? { minWidth: "16rem", height: "auto" }
          : { minWidth: "4rem", height: "auto" }
      }
    >
      <div
        className="cus-menu-left position-fixed left-0"
        style={
          showMenu
            ? { width: "16rem", height: "auto", top: "6.5rem" }
            : { width: "4rem", height: "auto", top: "6.5rem" }
        }
      >
        <div
          className={`p-3 w-100 text-secondary me-3 h6 cus-menu-item text-nowrap cus-menu-item--active`}
        >
          <i className="bi bi-house-door-fill h4 me-3" />
          {showMenu && <span>Trang chính</span>}
        </div>
        <div
          className={`p-3 w-100 text-secondary me-3 h6 cus-menu-item text-nowrap`}
        >
          <i className="bi bi-calendar-event h4 me-3" />
          {showMenu && <span>Sự kiện sắp tới</span>}
        </div>
        <div
          className={`p-3 w-100 text-secondary me-3 h6 cus-menu-item text-nowrap`}
        >
          <i className="bi bi-gear-fill h4 me-3" />
          {showMenu && <span>Cài đặt</span>}
        </div>
      </div>
    </div>
  )
}

export default LeftMenu
