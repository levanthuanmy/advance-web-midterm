import React, { createContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Cookies from "universal-cookie"
import { get, post } from "../../api"
import CustomSpinner from "../../components/CustomSpinner"
import ExercisePage from "./ExercisePage"
import GradePage from "./GradePage"
import Main from "./Main"
import MemberPage from "./MemberPage"

export const ThemeColorContext = createContext()

const ClassroomPage = ({ getThemeColor, currentTab }) => {
  const { id } = useParams()

  const [resClassroom, setResClassroom] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isHost, setIsHost] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const [students, setStudents] = useState()
  const [teachers, setTeachers] = useState()
  const [token] = useState(new Cookies().get("token"))

  const getClassroom = async () => {
    try {
      !isLoading && setIsLoading(true)

      const res = await get(`/classrooms/${id}`, token, {})

      setResClassroom(res)
      getThemeColor(res.themeColor)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("getClassroom - error", error)
    }
  }

  const getMembers = async () => {
    try {
      !isLoading && setIsLoading(true)
      const body = { classroomId: id }

      const res = await post("/students-teachers", token, {}, body)
      console.log("getMembers - res", res)

      setStudents(res?.students)
      setTeachers(res?.teachers)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)

      console.log("getMembers - error", error)
    }
  }

  useEffect(() => {
    if (teachers) {
      const userId = JSON.parse(
        window?.localStorage?.getItem("user-info") || {}
      )?._id

      const checkHost = userId === teachers[0]?.id

      if (checkHost) {
        setIsHost(checkHost)
        setIsTeacher(checkHost)
      } else {
        const checkTeacher =
          teachers.findIndex((teacher) => teacher.id === userId) >= 0

        setIsTeacher(checkTeacher)
      }
    }
  }, [teachers])

  useEffect(() => {
    window.scrollTo(0, 0)

    if (token?.length && token !== "undefined" && id) {
      getClassroom()
      getMembers()
    }
  }, [id, token])

  const renderMainContent = () => {
    if (currentTab === 0)
      return <Main resClassroom={resClassroom} isHost={isHost} />
    if (currentTab === 1)
      return (
        <ExercisePage
          classroomId={id}
          assignments={resClassroom?.assignments?.params}
          totalPoint={resClassroom?.assignments?.total}
          sumPoint={resClassroom?.assignments?.sum}
        />
      )
    if (currentTab === 2)
      return (
        <MemberPage
          students={students}
          teachers={teachers}
          resClassroom={resClassroom}
        />
      )
    if (currentTab === 3) return <GradePage />
    return <></>
  }

  return (
    <div className="px-4 w-100 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: "60rem" }}>
        <ThemeColorContext.Provider value={resClassroom?.themeColor}>
          {isLoading ? <CustomSpinner /> : renderMainContent()}
        </ThemeColorContext.Provider>
      </div>
    </div>
  )
}

export default ClassroomPage
