import React, { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { get, post } from "../api"

const GradeReview = ({ gradeList, resReviewId, isTeacher, studentId, postGrade }) => {
  const [token] = useState(new Cookies().get("token"))
  const [reviewId, setReviewId] = useState(null)
  const [resReview, setResReview] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const getReviewById = async (rvId) => {
    try {
      setIsLoading(true)

      const res = await get(`/grade-review-comment/${rvId}`, token)
      console.log("getReviewById - res", res)
      setResReview(res)
    } catch (error) {
      console.log("getReviewById - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createComment = async (data) => {
    try {
      setIsLoading(true)

      const res = await post(`/add-grade-review-comment`, token, {}, data)

      setResReview(res)
    } catch (error) {
      console.log("createComment - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    if (!data?.comment.length) return
    data = { ...data, reviewId }
    createComment(data)
    reset()
  }

  useEffect(() => {
    if (!Boolean(isTeacher)) {
      const userStudentId = JSON.parse(
        window?.localStorage?.getItem("user-info") || {}
      )?.studentId

      if (userStudentId && gradeList) {
        setReviewId(
          gradeList?.find(
            (itemGradeList) => itemGradeList?.studentId === userStudentId
          )?.reviewId
        )
      }
    }
  }, [gradeList, isTeacher])

  useEffect(() => {
    if (reviewId) {
      getReviewById(reviewId)
    }
  }, [reviewId])

  useEffect(() => {
    if (resReviewId) {
      setReviewId(resReviewId)
    }
  }, [resReviewId])

  return resReview ? (
    <div className="mt-3 cus-rounded-dot75rem border position-relative">
      <div className="h4 p-3 border-bottom d-flex justify-content-between align-items-center">
        <div className="">
          <div>{resReview?.comments[0]?.name}</div>
          <div className="h6 text-secondary mt-2">
            Điểm mong muốn: {resReview?.expectedGrade}
          </div>
        </div>
        {isTeacher && <Button className="" onClick={() => {
          postGrade(studentId, undefined)
        }}>Không đồng ý</Button>}
        {isTeacher && <Button className="" onClick={() => {
          postGrade(studentId, resReview?.expectedGrade)
        }}>Đồng ý yêu cầu</Button>}
      </div>

      <div className="p-2 px-3">
        {resReview?.comments
          ?.slice()
          ?.reverse()
          ?.map((itemReview, id) => (
            <div
              key={id}
              className={`${
                id % 2 === 0 ? "bg-light" : "bg-white"
              } rounded-3 mt-2 p-2 border`}
            >
              <div className="h6">{itemReview.name}</div>
              <div>{itemReview.comment}</div>
            </div>
          ))}
      </div>

      <Form className="row p-3 m-0 mt-3 border-top">
        <Form.Control
          className="col"
          placeholder="Thêm bình luận mới"
          {...register("comment")}
        />
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="col-auto ms-3"
        >
          Gửi
        </Button>
      </Form>
    </div>
  ) : (
    <></>
  )
}

export default GradeReview
