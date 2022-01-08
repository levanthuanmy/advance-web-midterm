import React, { useContext } from "react"
import { Button, Table } from "react-bootstrap"
import { useTable } from "react-table"
import { ThemeColorContext } from "../pages/ClassroomPage"
import {post} from "../api";

const AssignmentGradeList = ({ columns, data, assignmentIds, assignmentIsFinals, setFinal }) => {
  const {
    getTableProps, // table props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data,
  })

  const isAssignmentColumn = (accessor) => {
    return (
      accessor !== "total" && accessor !== "name" && accessor !== "studentId"
    )
  }

  const handleFinalizeAssignment = async (assignmentCode) => {
    const id = assignmentCode.split(`[`)[1].split(`]`)[0]
    setFinal(assignmentIds[id], !assignmentIsFinals[id])
  }

  const themeColor = useContext(ThemeColorContext)

  return (
    <Table borderless hover className="shadow" {...getTableProps()}>
      <tbody className="rounded-3">
        {headerGroups.map((headerGroup) => (
          <tr
            style={{ backgroundColor: themeColor }}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <td
                className="text-white fs-3 px-3 border-start"
                {...column.getHeaderProps()}
              >
                {column.render("Header")}
                {isAssignmentColumn(column.id) && (
                  <Button
                    variant="light"
                    className="ms-2"
                    onClick={() => handleFinalizeAssignment(column.id)}
                  >
                    {!Boolean(assignmentIsFinals[column.id.split(`[`)[1].split(`]`)[0]]) ? "Báo điểm" : "Huỷ báo điểm"}
                  </Button>
                )}
              </td>
            ))}
          </tr>
        ))}

        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    className="px-3 fs-5 border-start"
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default AssignmentGradeList
