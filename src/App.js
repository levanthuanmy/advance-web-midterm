import React, { useEffect, useMemo, useRef, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Cookies from 'universal-cookie'
import { get } from "./api"
import HandleLogin from "./components/HandleLogin"
import LeftMenu from "./components/LeftMenu"
import TopNav from "./components/TopNav"
import ClassroomPage from "./pages/ClassroomPage"
import HomePage from "./pages/HomePage"
import PreJoinClassPage from "./pages/PreJoinClassPage"
import UserInformationPage from "./pages/UserInformationPage"

const App = () => {
  const [resClassrooms, setResClassrooms] = useState()
  const [currentTab, setCurrentTab] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [isFixedNav, setIsFixedNav] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [themeColor, setThemeColor] = useState()
  const [isShowLogin, setIsShowLogin] = useState(false)

  const [token] = useState(new Cookies().get('token'))
  // const cookies = new Cookies()

  // return cookies.get('token')}, [cookies])

  const ref = useRef(null)

  const handleWindowScroll = () => {
    setIsFixedNav(+window.scrollY >= 80)
  }

  const getClassrooms = async () => {
    try {
      const headers = { 'Content-Type': 'application/json; charset=UTF-8', 'Authorization': `Bearer ${token}` }

      const res = await get(`/classrooms`, {}, headers)

      setResClassrooms(res)
      res && setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token?.length && token !== 'undefined') {
      getClassrooms()
    }
    else {
      setIsShowLogin(true)
    }
  }, [token])

  useEffect(() => {
    window.addEventListener("scroll", () => handleWindowScroll())
    return () =>
      window.removeEventListener("scroll", () =>
        console.log("remove scroll event")
      )
  }, [])


  return (
    <>

      <HandleLogin isShowLogin={isShowLogin} setIsShowLogin={setIsShowLogin} />

      <TopNav
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        isFixed={isFixedNav}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        themeColor={themeColor}
      />

      <div ref={ref} className="d-flex mt-4">

        <LeftMenu showMenu={showMenu} resClassrooms={resClassrooms} />

        <div id="mainContent" className="w-100" style={{ paddingLeft: '5rem' }}>
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
          </Routes>
        </div>

      </div>
    </>
  )
}

export default App
