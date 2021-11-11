import Button from "@restart/ui/esm/Button"
import React, { useEffect, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { get, post } from "../api"
import ClassroomList from "../components/ClassroomList"

const HomePage = ({showMenu}) => {
  const [resClassrooms, setResClassrooms] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const getClassrooms = async () => {
    try {
      const res = await get(`/classrooms`)
      setResClassrooms(res)
      res && setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const createClassroom = async (body) => {
    try {
      setIsLoading(true)
      const res = await post(`/classrooms`, {}, body)
      setResClassrooms([...resClassrooms, res])
      setIsLoading(false)
    } catch (error) {
      console.log("createClassroom -> error", error)
    }
  }

  useEffect(() => {
    getClassrooms()
  }, [])

  const onSubmit = (data) => {
    createClassroom(JSON.stringify(data))
    onHideModal()
  }

  const onHideModal = () => {
    setIsShowModal(false)
    reset()
  }

  const renderModal = () => (
    <Modal
      show={isShowModal}
      onHide={() => onHideModal()}
      size=""
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Tạo lớp học mới
        </Modal.Title>
      </Modal.Header>

      <Form className="" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tên lớp học (bắt buộc)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên lớp học"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-danger">Bạn cần nhập tên lớp học.</span>
            )}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Môn học</Form.Label>
            <Form.Control
              type="text"
              placeholder="Môn học"
              {...register("subject")}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              type="text"
              placeholder="Mô tả"
              {...register("description")}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Ảnh bìa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Điền liên kết ảnh"
              {...register("banner")}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Phòng học</Form.Label>
            <Form.Control
              type="text"
              placeholder="Phòng học"
              {...register("room")}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit">Tạo</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )

  return (
    <>
      <div className="ps-4 d-flex align-items-center">
        <div className="h3 text-secondary">Lớp học của bạn</div>

        <div
          className="ms-4 text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center cus-add-button"
          onClick={() => setIsShowModal(true)}
        >
          <div className="h1 user-select-none">+</div>
        </div>
      </div>

      <ClassroomList
        isLoading={isLoading}
        showMenu={showMenu}
        resClassrooms={resClassrooms}
      />

      {renderModal()}
    </>
  )
}

export default HomePage
