import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { get } from "../../api"
import ExercisePage from "./ExercisePage"
import GradePage from "./GradePage"
import Main from "./Main"
import MemberPage from "./MemberPage"

const ClassroomPage = ({ getThemeColor, currentTab }) => {
  const { id } = useParams()

  const [resClassroom, setResClassroom] = useState()

  const getClassroom = async () => {
    try {
      const res = await get(`/classrooms/${id}`)
      setResClassroom(res)
      getThemeColor(res.themeColor)
    } catch (error) {
      console.log("getClassroom ⟩ error", error)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getClassroom()
  }, [id])

  const renderMainContent = () => {
    if (currentTab === 0) return <Main resClassroom={resClassroom} />
    if (currentTab === 1) return <ExercisePage />
    if (currentTab === 2) return <MemberPage />
    if (currentTab === 3) return <GradePage />
  }

  return (
    <div className="px-4 w-100 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: "60rem" }}>
        {renderMainContent()}
      </div>
    </div>
  )
}

export default ClassroomPage
