import React, { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import { get } from "../../api"
import AssignmentGradeList from "../../components/AssignmentGradeList"

const GradePage = ({ classroomId }) => {
  const [data, setData] = useState([])
  const [columnsTemplate, setColumnsTemplate] = useState([])

  const cookies = new Cookies()

  const getAssignmentsName = async () => {
    try {
      const assignmentNames = []
      const allAssignmentResult = await get(
        `/assignments/${classroomId}`,
        cookies.get("token"),
        {}
      )

      allAssignmentResult?.params?.forEach((assignment) => {
        assignmentNames.push(assignment.name)
      })

      return assignmentNames
    } catch (error) {
      console.log("getAssignmentsName - error", error)
      return ""
    }
  }

  const handleData = async () => {
    try {
      const assignmentNames = await getAssignmentsName()

      const result = await get(
        `/get-grade-board/${classroomId}`,
        cookies.get("token"),
        {}
      )
      console.log("; - result", result)

      //template
      //thêm cột ID - name
      let columns = [
        {
          Header: "Mã số",
          accessor: "studentId",
        },
        {
          Header: "Tên",
          accessor: "name",
        },
      ]

      //đẩy từng cột pa vào
      for (let i = 0; i < assignmentNames.length; i++) {
        columns.push({
          Header: assignmentNames[i],
          accessor: `assignmentGrade[${i}]`,
        })
      }

      //thêm cột total
      columns.push({
        Header: "Tổng điểm",
        accessor: "total",
      })
      //template

      setColumnsTemplate([...columns])

      setData(
        result.map((item) => {
          const newItem = {
            studentId: item.studentId,
            name: item.name,
            total: item.total,
            assignmentGrade: item.assignmentGrade.map((a) => a.grade),
          }
          return newItem
        })
      )
    } catch (error) {
      console.log("handleData - error", error)
    }
  }

  useEffect(() => {
    handleData()
  }, [classroomId])

  return (
    <div className="py-5">
      <AssignmentGradeList columns={columnsTemplate} data={data} />
    </div>
  )
}

export default GradePage
