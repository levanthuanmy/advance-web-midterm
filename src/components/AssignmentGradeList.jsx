import React, { useContext } from "react"
import { Button, Table } from "react-bootstrap"
import { useTable } from "react-table"
import { ThemeColorContext } from "../pages/ClassroomPage"

const AssignmentGradeList = ({ columns, data, assignmentIds }) => {
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

  const handleFinalizeAssignment = (assignmentCode) => {
    // assignmentCode sẽ là cái column.id : assignmentGrade[0] ..., t xử lý để lấy cái id 0 ra 🤡
    const id = assignmentCode.split(`[`)[1].split(`]`)[0]
    console.log(assignmentIds[id])
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
                    kkk
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
