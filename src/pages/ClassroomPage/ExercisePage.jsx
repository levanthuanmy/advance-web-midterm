import React, { useContext, useState } from "react"
import { Form, Modal, Button } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { ThemeColorContext } from "."
import { post } from "../../api"
import AssignmentList from "../../components/AssignmentList"

const ExercisePage = ({ classroomId, assignments }) => {
  const themeColorContext = useContext(ThemeColorContext)
  const [isShowModal, setIsShowModal] = useState(false)
  const [token] = useState(new Cookies().get("token"))
  const [isLoading, setIsLoading] = useState(false)
  const [listAssign, setListAssign] = useState(assignments)
  console.log("ExercisePage - listAssign", listAssign?.length)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const createAssignment = async (body) => {
    try {
      setIsLoading(true)

      const res = await post(`/create-assignment`, token, {}, body)

      setListAssign(res.assignments)
      setIsLoading(false)
      setIsShowModal(false)
    } catch (error) {
      setIsLoading(false)
      setIsShowModal(false)
      console.log("createAssignment - error", error)
    }
  }

  const onSubmit = (data) => {
    const body = { classroomId, assignment: data }
    console.log("onSubmit - body", body)

    createAssignment(body)
  }

  const renderModal = () => {
    return (
      <Modal
        show={isShowModal}
        onHide={() => {
          setIsShowModal(false)
          reset()
        }}
        size=""
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thêm một bài tập
          </Modal.Title>
        </Modal.Header>

        <Form className="px-4 pb-4" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="pt-3">
            <Form.Label>Tên bài tập</Form.Label>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="text"
              {...register("name", {
                required: "Bạn cần nhập tên lớp",
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
          <Button type="submit" className="float-end" disabled={isLoading}>
            Tạo
          </Button>
        </Form>
      </Modal>
    )
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-end">
        <div className="fs-4 mb-0">Tạo bài tập mới</div>
        <div
          className="rounded-circle border cus-toggle-menu-btn d-flex justify-content-center align-items-center mx-4"
          onClick={() => setIsShowModal(true)}
        >
          <i
            className="bi bi-plus-lg fs-3"
            style={{
              color: themeColorContext,
            }}
          />
        </div>
      </div>
      {renderModal()}
      <AssignmentList
        assignments={listAssign}
        setAssignments={setListAssign}
        classroomId={classroomId}
      />
    </div>
  )
}

export default ExercisePage
