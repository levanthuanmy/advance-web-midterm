import React, { useContext, useEffect, useState } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie"
import { ThemeColorContext } from "."
import { get, post } from "../../api"
import AssignmentList from "../../components/AssignmentList"
import CustomSpinner from "../../components/CustomSpinner"
import useDebounce from "../../hooks/useDebounce"

const ExercisePage = ({ resClassroom, isTeacher, students }) => {
  const themeColorContext = useContext(ThemeColorContext)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowEditTotalModal, setIsShowEditTotalModal] = useState(false)
  const [token] = useState(new Cookies().get("token"))
  const [isLoading, setIsLoading] = useState(false)
  const [listAssign, setListAssign] = useState()
  const [total, setTotal] = useState()
  const [sum, setSum] = useState()
  const [isUpdateList, setIsUpdateList] = useState(false)

  const debounceUpdateListAssign = useDebounce(listAssign, 1500)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm()

  const createAssignment = async (body) => {
    try {
      setIsLoading(true)

      const res = await post(`/create-assignment`, token, {}, body)

      setListAssign(res.params)
      setTotal(res.total)
      setSum(res.sum)
      setIsLoading(false)
      setIsShowModal(false)
    } catch (error) {
      setIsLoading(false)
      setIsShowModal(false)
      console.log("createAssignment - error", error)
    }
  }

  const updateTotal = async (body) => {
    try {
      setIsLoading(true)

      const res = await post(`/set-assignment-total-point`, token, {}, body)
      console.log(res)
      setTotal(res.total)
      setIsLoading(false)
      setIsShowEditTotalModal(false)
    } catch (error) {
      setIsLoading(false)
      setIsShowEditTotalModal(false)
      console.log("update total - error", error)
    }
  }

  const getAssignments = async () => {
    try {
      !isLoading && setIsLoading(true)

      const res = await get(`/assignments/${resClassroom?._id}`, token)
      console.log("getAssignments - res", res)

      setListAssign(res.params)
      setTotal(res.total)
      setSum(res.sum)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("getAssignments - error", error)
    }
  }

  const onSubmit = (data) => {
    const body = { classroomId: resClassroom?._id, assignment: data }
    createAssignment(body)
  }

  const onSubmitEditTotal = (data) => {
    const body = { classroomId: resClassroom?._id, total: data.total }
    updateTotal(body)
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
            Th??m m???t b??i t???p
          </Modal.Title>
        </Modal.Header>

        <Form className="px-4 pb-4" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="pt-3">
            <Form.Label>T??n b??i t???p</Form.Label>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="text"
              {...register("name", {
                required: "B???n c???n nh???p t??n b??i t???p",
              })}
            />
            {errors.name && (
              <small className="text-danger">{errors.name?.message}</small>
            )}
          </Form.Group>
          <Form.Group className="py-3">
            <Form.Label>S??? ??i???m</Form.Label>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="number"
              min="0"
              max={Number(total) - Number(sum)}
              {...register("point", {
                required: "B???n c???n nh???p ??i???m",
              })}
            />
            <small className="text-secondary">
              S??? ??i???m c???n ph???i n???m trong kho???ng t??? 0 ?????n{" "}
              {Number(total) - Number(sum)}
            </small>

            {errors.point && (
              <small className="text-danger">
                <br />
                {errors.point?.message}
              </small>
            )}
          </Form.Group>
          <Button type="submit" className="float-end" disabled={isLoading}>
            T???o
          </Button>
        </Form>
      </Modal>
    )
  }

  const renderEditTotalModal = () => {
    return (
      <Modal
        show={isShowEditTotalModal}
        onHide={() => {
          setIsShowEditTotalModal(false)
          reset()
        }}
        size=""
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            C???p nh???p ??i???m t???ng
          </Modal.Title>
        </Modal.Header>

        <Form className="px-4 pb-4" onSubmit={handleSubmit2(onSubmitEditTotal)}>
          <Form.Group className="py-3">
            <Form.Label>S??? ??i???m</Form.Label>
            <Form.Control
              className="cus-rounded-dot75rem py-2 px-3"
              type="number"
              min={Number(sum)}
              {...register2("total", {
                required: "B???n c???n nh???p ??i???m",
              })}
            />
            <small className="text-secondary">
              S??? ??i???m c???n ph???i l???n h??n {Number(sum)}
            </small>

            {errors2.total && (
              <small className="text-danger">
                <br />
                {errors2.total?.message}
              </small>
            )}
          </Form.Group>
          <Button type="submit" className="float-end" disabled={isLoading}>
            C???p nh???t
          </Button>
        </Form>
      </Modal>
    )
  }

  useEffect(() => {
    resClassroom?._id && getAssignments()
  }, [resClassroom])

  const updateListAssign = async (newListAssign) => {
    try {
      await post(
        `/reorder-assignments`,
        token,
        {},
        { classroomId: resClassroom?._id, assignments: newListAssign }
      )

      console.log("updateListAssign")

      setIsUpdateList(false)
    } catch (error) {
      setIsUpdateList(false)
      console.log("updateListAssign - error", error)
    }
  }

  useEffect(() => {
    if (debounceUpdateListAssign) {
      setIsUpdateList(true)
      updateListAssign(listAssign)
    }
  }, [debounceUpdateListAssign])

  if (!listAssign) return <CustomSpinner />

  return (
    listAssign && (
      <div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="fs-4 mb-0 d-flex align-items-center">
            T???ng ??i???m: {total}
            {isTeacher && (
              <div
                className="rounded-circle border cus-toggle-menu-btn d-flex justify-content-center align-items-center mx-4"
                onClick={() => {
                  reset()
                  setIsShowEditTotalModal(true)
                }}
              >
                <i
                  className="bi bi-pencil fs-3"
                  style={{
                    color: themeColorContext,
                  }}
                />
              </div>
            )}
          </div>
          {isTeacher && (
            <div className="fs-4 mb-0 d-flex align-items-center">
              T???o b??i t???p m???i
              <div
                className="rounded-circle border cus-toggle-menu-btn d-flex justify-content-center align-items-center mx-4"
                onClick={() => {
                  reset()
                  setIsShowModal(true)
                }}
              >
                <i
                  className="bi bi-plus-lg fs-3"
                  style={{
                    color: themeColorContext,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {renderModal()}
        {renderEditTotalModal()}

        <AssignmentList
          assignments={listAssign}
          setAssignments={setListAssign}
          classroom={resClassroom}
          setSumPoint={setSum}
          setTotalPoint={setTotal}
          isTeacher={isTeacher}
          students={students}
        />

        {isUpdateList && (
          <div className="position-fixed bottom-0 left-0">
            <div className="rounded-pill px-4 py-3 border shadow-sm mb-4 fw-bold text-secondary bg-white">
              <Spinner
                variant="secondary"
                size="sm"
                animation="border"
                className="me-3"
              />
              ??ang c???p nh???t
            </div>
          </div>
        )}
      </div>
    )
  )
}

export default ExercisePage
