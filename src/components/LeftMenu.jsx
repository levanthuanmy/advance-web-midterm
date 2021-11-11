import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const LeftMenu = ({ showMenu, resClassrooms }) => {
  // const [current, setCurrent] = useState(initialState)
  const navigate = useNavigate()
  const handleClassClicked = () => {}

  return (
    <div
      className={`cus-menu-left position-fixed left-0 bg-white pe-3 py-3 ${
        showMenu && "overflow-auto"
      }`}
      style={{
        width: showMenu ? "17rem" : "5rem",
        height: "100%",
        top: "5rem",
        zIndex: 2,
        borderRight: showMenu ? "solid 1px rgba(100, 100, 100, 0.2)" : "",
      }}
    >
      <div
        className={`p-3 w-100 text-secondary me-3 h6 cus-menu-item text-nowrap cus-menu-item--active`}
        onClick={() => navigate("/")}
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
      <div id="line" className="ms-3 mb-2 border-bottom" />
      {showMenu &&
        resClassrooms?.map((classroom, id) => (
          <div className="p-3 w-100 text-secondary text-nowrap text-truncate h6 cus-menu-item cus-menu-item--active">
            {classroom.name}
          </div>
        ))}
    </div>
  )
}

export default LeftMenu
