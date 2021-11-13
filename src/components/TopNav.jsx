import React, { useEffect, useState } from "react"
import { Image } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"

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

  const handleTabClicked = (id) => {
    setCurrentTab(+id)
  }

  const tabs = [
    { name: "Bảng tin", id: 0 },
    { name: "Bài tập trên lớp", id: 1 },
    { name: "Mọi người", id: 2 },
    { name: "Số điểm", id: 3 },
  ]

  useEffect(() => {
    const isInClass = location.pathname.includes("/c/")
    setIsClass(isInClass)
    !isInClass && setCurrentTab(0)
  }, [location.pathname, setCurrentTab])

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
      >
        <Image
          src={`/images/default-user-${
            Math.floor(Math.random() * 2) ? "wo" : ""
          }man.png`}
          fluid
          className="rounded-circle"
        />
      </div>
    </div>
  )
}

export default TopNav
