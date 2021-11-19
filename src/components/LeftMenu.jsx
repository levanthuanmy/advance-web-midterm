import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const LeftMenu = ({ showMenu, resClassrooms }) => {
  const [currentClass, setCurrentClass] = useState()
  const [currentMenuItem, setCurrentMenuItem] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClassClicked = (classId, id) => {
    setCurrentClass(id)
    navigate(`/c/${classId}`)
  }

  const handleMenuItemClicked = (menuItemUrl, menuItemId) => {
    setCurrentMenuItem(menuItemId)
    navigate(menuItemUrl)
  }

  useEffect(() => {
    const { pathname } = location
    if (pathname.includes("/c/")) {
      const classId = pathname.split("/")[2]
      const currId = resClassrooms?.findIndex((classroom) =>
        classroom?._id.includes(classId)
      )

      setCurrentClass(currId)
      setCurrentMenuItem(-1)
    } else {
      setCurrentMenuItem(0)
      setCurrentClass(-1)
    }
  }, [location, location.pathname, resClassrooms])

  const menuList = [
    { id: 0, name: "Trang chính", url: "/", icon: "bi-house-door-fill" },
    { id: 1, name: "Sự kiện sắp tới", url: "", icon: "bi-calendar-event" },
    { id: 2, name: "Cài đặt", url: "", icon: "bi-gear-fill" },
  ]

  return (
    <div
      className={`cus-menu-left position-fixed left-0 bg-white pe-3 py-3 ${
        showMenu && "overflow-auto"
      }`}
      style={{
        width: showMenu ? "17rem" : "5rem",
        borderRight: showMenu ? "solid 1px rgba(100, 100, 100, 0.2)" : "",
      }}
    >
      {menuList.map((menuItem, id) => (
        <div
          key={id}
          className={`p-3 w-100 text-secondary me-3 h6 cus-menu-item text-nowrap ${
            currentMenuItem === menuItem.id && "cus-menu-item--active"
          }`}
          onClick={() => handleMenuItemClicked(menuItem.url, menuItem.id)}
        >
          <i className={`bi ${menuItem.icon} h4 me-3`} />
          {showMenu && menuItem.name}
        </div>
      ))}

      {showMenu && <div id="line" className="ms-3 mb-2 border-bottom" />}

      {showMenu &&
        resClassrooms?.map((classroom, id) => (
          <div
            key={id}
            className={`p-3 w-100 text-secondary text-nowrap text-truncate h6 cus-menu-item ${
              currentClass === id && "cus-menu-item--active"
            }`}
            onClick={() => handleClassClicked(classroom?._id, id)}
          >
            <i
              className={`bi bi-circle-fill h4 me-3`}
              style={{ color: classroom?.themeColor }}
            />
            {classroom.name}
          </div>
        ))}
    </div>
  )
}

export default LeftMenu
