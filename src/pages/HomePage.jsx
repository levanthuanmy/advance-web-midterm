import React, { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import { post } from "../api"
import ClassroomList from "../components/ClassroomList"

const HomePage = ({
  resClassrooms,
  setResClassrooms,
  isLoading,
  setIsLoading,
}) => {
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowModalCode, setIsShowModalCode] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm()

  const cookies = new Cookies()

  const createClassroom = async (body) => {
    try {
      setIsLoading(true)

      const res = await post(
        `/create-classroom`,
        cookies.get("token"),
        {},
        body
      )

      setResClassrooms([...resClassrooms, res])
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)

      console.log("createClassroom - error", error)
    }
  }

  const onSubmit = (data) => {
    createClassroom(data)
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

        <Button variant="primary" type="submit" className="m-3 float-end">
          Tạo
        </Button>
      </Form>
    </Modal>
  )

  const renderInputCode = () => (
    <Modal
      show={isShowModalCode}
      onHide={() => setIsShowModalCode(false)}
      size=""
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Gửi lời mời đến email
        </Modal.Title>
      </Modal.Header>

      <Form>
        <Form.Group className="p-4">
          <Form.Control
            className="cus-rounded-dot75rem py-2 px-3"
            type="text"
            placeholder="Nhập code của lớp học"
            {...register("code", {
              required: "Bạn cần nhập code",
            })}
          />
          {errors.code && (
            <small className="text-danger">{errors.toEmail?.message}</small>
          )}
        </Form.Group>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => navigate(`/join?code=${getValues("code")}`)}
          >
            Tham gia
          </Button>
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

        <Button
          variant="secondary"
          className="cus-rounded-dot75rem ms-3 py-2"
          onClick={() => setIsShowModalCode(true)}
        >
          Tham gia một lớp học
        </Button>
      </div>

      <ClassroomList isLoading={isLoading} resClassrooms={resClassrooms} />

      {renderModal()}
      {renderInputCode()}
    </>
  )
}

export default HomePage
