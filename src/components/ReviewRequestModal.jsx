import React, { useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { post } from "../api"

const ReviewRequestModal = ({
  show,
  onHide,
  maxGrade,
  classroomId,
  assignmentCode,
  setResReviewId,
}) => {
  const [token] = useState(new Cookies().get("token"))
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)

  const createReviewRequest = async (data) => {
    try {
      setIsLoading(true)

      const res = await post(`/grade-review-create`, token, {}, data)

      setResReviewId(res?._id)
      alert("Thành công")
      onHide()
    } catch (error) {
      console.log("createReviewRequest - error", error)
      alert(error)
    } finally {
      setIsLoading(false)
      reset()
    }
  }

  const onSubmit = (data) => {
    data = {
      classroomId,
      assignmentCode,
      component: {
        comment: data?.comment,
        expectedGrade: Number(data?.expectedGrade),
      },
    }

    createReviewRequest(data)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="shadow-lg cus-rounded-dot75rem"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Tạo phiếu phúc khảo
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Control
            className="cus-rounded-dot75rem"
            type="number"
            placeholder="Điểm mong muốn"
            min="0"
            max={maxGrade}
            {...register("expectedGrade", {
              required: "Bạn cần nhập điểm mong muốn",
            })}
          />
          {errors.expectedGrade && (
            <small className="text-danger">
              {errors.expectedGrade?.message}
            </small>
          )}

          <Form.Control
            className="mt-3 cus-rounded-dot75rem"
            type="text"
            as="textarea"
            placeholder="Lời nhắn"
            min="0"
            max={maxGrade}
            {...register("comment", {
              required: "Bạn cần nhập lời nhắn hoặc lý do phúc khảo",
            })}
          />
          {errors.comment && (
            <small className="text-danger">{errors.comment?.message}</small>
          )}

          <Button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            type="submit"
            className="float-end mt-3 cus-rounded-dot75rem"
          >
            {isLoading && (
              <Spinner
                size="sm"
                variant="light"
                animation="border"
                className="me-2"
              />
            )}
            Gửi yêu cầu
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ReviewRequestModal
