import React, { useEffect, useRef, useState } from "react"
import { Route, Routes } from "react-router-dom"
import LeftMenu from "./components/LeftMenu"
import TopNav from "./components/TopNav"
import ClassroomPage from "./pages/ClassroomPage"
import HomePage from "./pages/HomePage"

const App = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [isFixedNav, setIsFixedNav] = useState(false)
  const [themeColor, setThemeColor] = useState()
  const ref = useRef(null)

  const handleWindowScroll = () => {
    setIsFixedNav(+window.scrollY >= 80)
  }

  useEffect(() => {
    window.addEventListener("scroll", () => handleWindowScroll())
    return () =>
      window.removeEventListener("scroll", () =>
        console.log("remove scroll event")
      )
  }, [])

  return (
    <>

      <TopNav showMenu={showMenu} setShowMenu={setShowMenu} isFixed={isFixedNav} currentTab={currentTab} setCurrentTab={setCurrentTab} themeColor={themeColor} />

      <div ref={ref} className="d-flex mt-4">

        <LeftMenu showMenu={showMenu} />

        <div id="mainContent" className="w-100">
          <Routes>
            <Route path="/" element={<HomePage showMenu={showMenu} />} />
            <Route path="/c/:id" element={<ClassroomPage getThemeColor={setThemeColor} currentTab={currentTab} />} />
          </Routes>
        </div>

      </div>
    </>
  )
}

export default App
