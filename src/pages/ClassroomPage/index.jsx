import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Cookies from "universal-cookie"
import { get } from "../../api"
import CustomSpinner from "../../components/CustomSpinner"
import HandleLogin from "../../components/HandleLogin"
import ExercisePage from "./ExercisePage"
import GradePage from "./GradePage"
import Main from "./Main"
import MemberPage from "./MemberPage"

const ClassroomPage = ({ getThemeColor, currentTab }) => {
  const { id } = useParams()

  const [resClassroom, setResClassroom] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isHost, setIsHost] = useState()

  const cookies = new Cookies()

  const getClassroom = async () => {
    try {
      const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${cookies.get("token")}`,
      }

      !isLoading && setIsLoading(true)
      const res = await get(`/classrooms/${id}`, {}, headers)

      setResClassroom(res)
      getThemeColor(res.themeColor)
      setIsLoading(false)
    } catch (error) {
      console.log("getClassroom ⟩ error", error)
    }
  }

  useEffect(() => {
    if (resClassroom?.teachers) {
      const checkHost =
        JSON.parse(window?.localStorage?.getItem("user-info"))?._id ===
        resClassroom?.teachers[0]
      setIsHost(checkHost)
    }
  }, [resClassroom])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (cookies.get("token")?.length) {
      getClassroom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cookies.get("token")])

  const renderMainContent = () => {
    if (currentTab === 0)
      return <Main resClassroom={resClassroom} isHost={isHost} />
    if (currentTab === 1) return <ExercisePage />
    if (currentTab === 2) return <MemberPage />
    if (currentTab === 3) return <GradePage />
  }

  return (
    <div className="px-4 w-100 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: "60rem" }}>
        {isLoading ? <CustomSpinner /> : renderMainContent()}
      </div>
    </div>
  )
}

export default ClassroomPage
