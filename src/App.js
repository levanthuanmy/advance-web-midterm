import React, { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import Cookies from 'universal-cookie'
import { get } from "./api"
import HandleAdminLogin from "./components/HandleAdminLogin"
import HandleLogin from "./components/HandleLogin"
import LeftMenu from "./components/LeftMenu"
import TopNav from "./components/TopNav"
import AdminPage from "./pages/AdminPage"
import AdminManagement from "./pages/AdminPage/AdminManagement"
import ClassManagement from "./pages/AdminPage/ClassManagement"
import UserManagement from "./pages/AdminPage/UserManagement"
import ClassroomPage from "./pages/ClassroomPage"
import HomePage from "./pages/HomePage"
import PreJoinClassPage from "./pages/PreJoinClassPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import UserInformationPage from "./pages/UserInformationPage"

const App = () => {
  const location = useLocation()
  const [resClassrooms, setResClassrooms] = useState()
  const [currentTab, setCurrentTab] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [themeColor, setThemeColor] = useState()
  const [isShowLogin, setIsShowLogin] = useState(false)
  const [isShowAdminLogin, setIsShowAdminLogin] = useState(false)

  const [token] = useState(new Cookies().get('token'))

  const getClassrooms = async () => {
    try {
      const res = await get(`/classrooms`, token, {})

      setResClassrooms(res)
      res && setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const pathname = location.pathname
    const isLogin = token?.length && token !== 'undefined'
    if (isLogin) {
      getClassrooms()
    }
    else if (pathname.includes('/reset-password')) {
      setIsShowLogin(false)
    }
    else if (pathname.includes('/admin')) {
      setIsShowLogin(false)
      if (!isLogin) {
        setIsShowAdminLogin(true)
      }
    }
    else {
      setIsShowLogin(true)
    }
  }, [location.pathname, token])

  return (
    <>

      <HandleLogin isShowLogin={isShowLogin} setIsShowLogin={setIsShowLogin} />
      <HandleAdminLogin show={isShowAdminLogin} onHide={() => setIsShowAdminLogin(false)} />

      <TopNav
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        themeColor={themeColor}
      />

      <div className="d-flex mt-4">

        <LeftMenu showMenu={showMenu} resClassrooms={resClassrooms} />

        <div id="mainContent" className="w-100" style={{ paddingLeft: '5rem', paddingBottom: '10rem', paddingTop: '5rem' }}>
          <Routes>
            <Route path="/" element={
              <HomePage
                resClassrooms={resClassrooms}
                setResClassrooms={setResClassrooms}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
            />

            <Route path="/c/:id" element={
              <ClassroomPage getThemeColor={setThemeColor} currentTab={currentTab} />
            }
            />

            <Route path="/c/:id/join" element={<PreJoinClassPage />} />

            <Route path="/user-info" element={<UserInformationPage />} />

            <Route path="/admin" element={<AdminPage />} />

            <Route path="/admin/users-management" element={<UserManagement />} />

            <Route path="/admin/admins-management" element={<AdminManagement />} />

            <Route path="/admin/classes-management" element={<ClassManagement />} />

            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </div>

      </div>
    </>
  )
}

export default App
