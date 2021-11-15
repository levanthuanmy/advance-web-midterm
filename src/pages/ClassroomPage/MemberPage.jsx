import React, { useEffect, useState } from "react"
import { Image } from "react-bootstrap"
import Cookies from "universal-cookie"
import { post } from "../../api"
import CustomSpinner from "../../components/CustomSpinner"

const MemberPage = ({ idClass }) => {
  const [students, setStudents] = useState()
  const [teachers, setTeachers] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const cookies = new Cookies()

  const getMembers = async () => {
    !isLoading && setIsLoading(true)
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${cookies.get("token")}`,
    }
    const body = { classroomId: idClass }

    const res = await post("/students-teachers", {}, body, headers)

    setStudents(res?.students)
    setTeachers(res?.teachers)

    setIsLoading(false)
  }

  useEffect(() => {
    getMembers()
  }, [])

  const renderItem = (item, id) => {
    return (
      <div key={id} className="d-flex border-bottom p-3 align-items-center">
        <div className="fs-3 me-3">#{id + 1}</div>
        <Image
          src={`/images/default-user-${
            Math.floor(Math.random() * 2) ? "wo" : ""
          }man.png`}
          fluid
          className="rounded-circle"
          style={{ width: "3rem", height: "3rem" }}
        />
        <div className="h6 ps-3 small m-0">{item?.name}</div>
      </div>
    )
  }

  if (isLoading) return <CustomSpinner />
  return (
    <div className="w-100">
      <div className="mb-5">
        <div className="border-bottom px-3 py-4 d-flex" style={{}}>
          <div className="h2 mb-0">Giáo viên</div>
          <div className="h6 mb-0 m-auto me-0">{teachers?.length} người</div>
        </div>
        {teachers?.map((teacher, id) => renderItem(teacher, id))}
      </div>

      <div>
        <div className="border-bottom px-3 py-4 d-flex" style={{}}>
          <div className="h2 mb-0">Học viên</div>
          <div className="h6 mb-0 m-auto me-0">{students?.length} người</div>
        </div>
        {students?.map((student, id) => renderItem(student, id))}
      </div>
    </div>
  )
}

export default MemberPage
