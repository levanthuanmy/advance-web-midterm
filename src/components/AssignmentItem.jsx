import React, { useContext, useRef } from "react"
import { Dropdown } from "react-bootstrap"
import { useDrag, useDrop } from "react-dnd"
import { ThemeColorContext } from "../pages/ClassroomPage"

const AssignmentItem = ({
  id,
  assignment,
  index,
  moveItem,
  setOnDelete,
  setOnEdit,
  setOnShowDetail,
  isTeacher,
  isFinal,
  setOnFinal
}) => {
  console.log('id', id)
  const ref = useRef(null)
  const themeColorContext = useContext(ThemeColorContext)

  const [{ handlerId }, drop] = useDrop({
    accept: "CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      className="position-relative rounded-circle cursor-pointer ms-3 d-flex justify-content-center align-items-center cus-toggle-menu-btn"
      style={{
        color: themeColorContext,
      }}
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    >
      <i className="fs-4 bi bi-three-dots-vertical" />
    </div>
  ))

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className="w-100 mb-5 px-4 bg-white d-flex align-items-center cus-assignment-item"
      style={{
        opacity: isDragging ? 0 : 1,
        color: themeColorContext,
        borderColor: themeColorContext,
      }}
    >
      <div
        className="rounded-circle border text-white d-flex justify-content-center align-items-center"
        style={{
          height: "3.5rem",
          width: "3.5rem",
          backgroundColor: themeColorContext,
        }}
      >
        <i className="bi bi-journals fs-4 m-auto" />
      </div>

      <div className="h3 mb-0 ms-4">{assignment?.name}</div>
      <div className="fs-5 mb-0 ms-auto">{assignment?.point} điểm</div>
      
      <Dropdown>
        <Dropdown.Toggle
          as={CustomToggle}
          id="dropdown-custom-components"
        ></Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            eventKey="1"
            className="text-center"
            onClick={() =>
              setOnShowDetail({ assignmentIndex: index, isShowDetail: true })
            }
          >
            Xem chi tiết
          </Dropdown.Item>

          <Dropdown.Divider />
          {isTeacher && (
            <>
            <Dropdown.Item
                eventKey="1"
                className="text-center"
                onClick={() =>
                  setOnFinal({
                    code: id,
                    isSetFinal: true,
                    isFinal: !isFinal,
                  })
                }
              >
                {isFinal ? "Huỷ báo tổng kết" : "Báo tổng kết"}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                eventKey="1"
                className="text-center"
                onClick={() =>
                  setOnEdit({
                    code: id,
                    isEdit: true,
                  })
                }
              >
                Sửa
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                eventKey="2"
                className="text-danger text-center"
                onClick={() =>
                  setOnDelete({
                    code: id,
                    isDelete: true,
                  })
                }
              >
                Xoá
              </Dropdown.Item>

            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default AssignmentItem
