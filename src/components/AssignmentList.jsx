import React, { useCallback, useState } from "react"
import update from "immutability-helper"
import AssignmentItem from "./AssignmentItem"

const AssignmentList = () => {
  const [resAssignments, setResAssignments] = useState([
    { id: 0, name: "kakaka", point: 100 },
    { id: 1, name: "abcde", point: 100 },
    { id: 2, name: "uwieortiqwp", point: 100 },
    { id: 3, name: "ncvmzx,xbs", point: 100 },
    { id: 4, name: "plplplplp", point: 100 },
  ])

  console.log("AssignmentList - resAssignments", resAssignments)

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = resAssignments[dragIndex]
      setResAssignments(
        update(resAssignments, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragItem],
          ],
        })
      )
    },
    [resAssignments]
  )

  return (
    <div className="">
      {resAssignments?.map((assignment, id) => (
        <AssignmentItem
          key={assignment.id}
          index={id}
          id={assignment?.id}
          assignment={assignment}
          moveItem={moveItem}
        />
      ))}
    </div>
  )
}

export default AssignmentList
