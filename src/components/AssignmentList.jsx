import React, { useCallback, useEffect, useState } from "react"
import update from "immutability-helper"
import AssignmentItem from "./AssignmentItem"
import { post } from "../api"
import Cookies from "universal-cookie"
import CustomSpinner from "./CustomSpinner"
import { Form, Modal, Button } from "react-bootstrap"
import { useForm } from "react-hook-form"

const AssignmentList = ({
  assignments,
  setAssignments,
  classroomId,
  setSumPoint,
  setTotalPoint,
}) => {
  const [onDelete, setOnDelete] = useState({ code: "", isDelete: false })
  const [onEdit, setOnEdit] = useState({
    code: "",
    isEdit: false,
  })
  const [token] = useState(new Cookies().get("token"))
  const [isShowModal, setIsShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = assignments[dragIndex]
      setAssignments(
        update(assignments, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragItem],
          ],
        })
      )
    },
    [assignments]
  )

  const deleteAssignment = async () => {
    try {
      const res = await post(
        `/delete-assignment`,
        token,
        {},
        { classroomId, assignmentCode: onDelete?.code }
      )
      setAssignments(res?.assignments?.params)
      setTotalPoint(res?.assignments?.total)
      setSumPoint(res?.assignments?.sum)
      setOnDelete({ code: "", isDelete: false })
    } catch (error) {
      setOnDelete({ code: "", isDelete: false })
      console.log("deleteAssignment - error", error)
    }
  }

  const editAssignment = async (body) => {
    try {
      const res = await post(`/update-assignment`, token, {}, body)

      setAssignments(res?.assignments?.params)
      setTotalPoint(res?.assignments?.total)
      setSumPoint(res?.assignments?.sum)
      setOnEdit({ code: "", isEdit: false })
    } catch (error) {
      setOnEdit({ code: "", isEdit: false })
      console.log("editAssignment - error", error)
    }
  }

  useEffect(() => {
    if (token) {
      if (onDelete?.isDelete) {
        deleteAssignment()
      }
      if (onEdit?.isEdit) {
        setIsShowModal(true)
      }
    }
  }, [token, onDelete, onEdit])

  const onSubmit = (data) => {
    setIsShowModal(false)

    const body = { classroomId, assignmentCode: onEdit?.code, assignment: data }

    editAssignment(body)
  }

  const renderModal = () => {
    return (
      <Modal
        show={isShowModal}
        onHide={() => {
          reset()
          setIsShowModal(false)
          setOnEdit({ code: "", isEdit: false })
        }}
        size=""
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Sửa một bài tập
          </Modal.Title>
        </Modal.Header>

        <Form className="px-4 pb-4" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="pt-3">
            <Form.Label>Tên bài tập</Form.Label>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="text"
              {...register("name", {
                required: "Bạn cần nhập tên bài tập",
              })}
            />
            {errors.name && (
              <small className="text-danger">{errors.name?.message}</small>
            )}
          </Form.Group>
          <Form.Group className="py-3">
            <Form.Label>Số điểm</Form.Label>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="number"
              min="0"
              {...register("point", {
                required: "Bạn cần nhập điểm",
              })}
            />
            {errors.point && (
              <small className="text-danger">{errors.point?.message}</small>
            )}
          </Form.Group>
          <Button type="submit" className="float-end">
            Tạo
          </Button>
        </Form>
      </Modal>
    )
  }

  if (onDelete?.isDelete || (onEdit?.isEdit && !isShowModal))
    return <CustomSpinner />

  return (
    <div className="mt-5">
      {renderModal()}
      {assignments?.map((assignment, id) => (
        <AssignmentItem
          key={assignment?.code}
          index={id}
          id={assignment?.code}
          assignment={assignment}
          moveItem={moveItem}
          setOnDelete={setOnDelete}
          setOnEdit={setOnEdit}
        />
      ))}
    </div>
  )
}

export default AssignmentList
