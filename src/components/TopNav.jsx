import React, { useEffect, useState } from "react"
import { Image } from "react-bootstrap"
import { set } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"

const tabs = [
  { name: "Bảng tin", id: 0 },
  { name: "Bài tập trên lớp", id: 1 },
  { name: "Mọi người", id: 2 },
  { name: "Số điểm", id: 3 },
]

const TopNav = ({
  showMenu,
  setShowMenu,
  isFixed,
  currentTab,
  setCurrentTab,
  themeColor,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isClass, setIsClass] = useState(false)
  const [isDropdown, setIsDropdown] = useState(false)
  const [userInfo, setUserInfo] = useState()

  const cookies = new Cookies()

  const handleTabClicked = (id) => {
    setCurrentTab(+id)
  }

  const handleLogoutClicked = () => {
    navigate("/")
    cookies.remove("token")
    window?.sessionStorage?.removeItem("access_token")
    window?.location?.reload()
    window?.localStorage?.clear()
  }

  useEffect(() => {
    const isInClass = location.pathname.includes("/c/")
    setIsClass(isInClass)
    !isInClass && setCurrentTab(0)

    const userInfoStorage = window?.localStorage?.getItem("user-info")
    if (userInfoStorage && userInfoStorage !== "undefined") {
      setUserInfo(JSON.parse(userInfoStorage))
    } else {
      setUserInfo({ name: "", email: "" })
    }
  }, [location.pathname, setCurrentTab])

  const renderDropDown = () => {
    return (
      <div
        className={`cus-avatar-dropdown position-relative float-end ${
          isDropdown && "cus-avatar-dropdown--show"
        }`}
      >
        <div className="mt-2 bg-white border shadow-sm cus-rounded-dot75rem text-truncate">
          <div className="pt-3 px-3 fw-bold d-flex justify-content-between align-items-center">
            {userInfo?.name}
            <i className="bi bi-x-lg" onClick={() => setIsDropdown(false)} />
          </div>
          <div className="mt-2 px-3 small fst-italic text-secondary">
            {userInfo?.email}
          </div>
          <div className="mt-3 border-top p-3 d-flex justify-content-between">
            <div className="cus-dropdown-opt text-center border cus-rounded-dot75rem p-2 text-secondary">
              <i className="bi bi-pencil-square fs-4" />
              <div className="small">Chỉnh sửa</div>
            </div>
            <div
              className="cus-dropdown-opt text-center border cus-rounded-dot75rem p-2 text-secondary"
              onClick={() => handleLogoutClicked()}
            >
              <i className="bi bi-box-arrow-left fs-4" />
              <div className="small">Đăng xuất</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`w-100 bg-white cus-top-nav d-flex align-items-center justify-content-between border-bottom ${
        isFixed && "position-fixed top-0 left-0 shadow-sm"
      }`}
    >
      <div id="left" className="d-flex align-items-center">
        <div
          className="cus-toggle-menu-btn ms-2 me-3 rounded-circle d-flex align-items-center justify-content-center text-secondary"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? (
            <i className="bi bi-x-lg h3 mb-0" />
          ) : (
            <i className="bi bi-list h2 mb-0" />
          )}
        </div>

        <div
          className="cus-title h2 mb-0 cursor-pointer"
          onClick={() => navigate("/")}
        >
          My Classroom
        </div>
      </div>

      {isClass && (
        <div id="middle" className="d-flex cursor-pointer h-100 text-secondary">
          {tabs.map((tab, id) => (
            <div
              key={id}
              className="px-3 cus-tab-item d-inline-flex align-items-center h-100"
              style={
                currentTab === tab.id
                  ? {
                      borderBottom: `solid 3px ${themeColor || "blue"}`,
                      color: themeColor || "blue",
                    }
                  : {}
              }
              onClick={() => handleTabClicked(tab.id)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      )}

      <div
        id="right"
        className="cus-my-avatar bg-secondary rounded-circle me-3 cursor-pointer"
        onMouseEnter={() => setIsDropdown(true)}
        onMouseLeave={() => setIsDropdown(false)}
      >
        <Image
          src={`/images/default-user-${
            Math.floor(Math.random() * 2) ? "wo" : ""
          }man.png`}
          fluid
          className="rounded-circle"
        />
        {renderDropDown()}
      </div>
    </div>
  )
}

export default TopNav
