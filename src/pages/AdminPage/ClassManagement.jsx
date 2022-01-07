import React, { useEffect, useState } from "react"
import { Button, FormControl, InputGroup, Table } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie/es6"
import { get } from "../../api"
import AdminViewClassDetail from "../../components/AdminViewClassDetail"

const ClassManagement = () => {
  const { register, handleSubmit } = useForm()
  const [token] = useState(new Cookies().get("token"))
  const [resClassList, setResClassList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState("asc")
  const [isShowModal, setIsShowModal] = useState(false)
  const [isReGet, setIsReGet] = useState(true)
  const [currentClass, setCurrentClass] = useState()

  const getListClass = async () => {
    try {
      const res = await get(`/admin/class-list`, token)
      setResClassList(res)
    } catch (error) {
      console.log("getListClass - error", error)
    }
  }

  const onSubmit = (data) => {}

  const onShowDetailClass = (classroom) => {
    setCurrentClass(classroom)
    setIsShowModal(true)
  }

  const onHide = () => {
    setCurrentClass(null)
    setIsShowModal(false)
  }

  useEffect(() => {
    if (token) {
      getListClass()
    }
  }, [token])

  return (
    <>
      <AdminViewClassDetail
        show={isShowModal}
        onHide={onHide}
        classroom={currentClass}
      />

      <div className="mx-5">
        <div className="fs-2 mb-5">Quản lý lớp học</div>

        <InputGroup className="mb-3 cus-rounded-dot75rem" size="lg">
          <FormControl
            type="text"
            placeholder="Tìm người dùng theo tên hoặc email"
            {...register("searchText")}
          />
          <Button
            variant="primary"
            id="button-addon1"
            onClick={handleSubmit(onSubmit)}
          >
            <i class="bi bi-search" />
          </Button>
        </InputGroup>
      </div>

      <Button
        onClick={() => {
          setSort(sort === "asc" ? "desc" : "asc")
          setIsReGet(true)
        }}
        className="cus-rounded-dot75rem mt-3 ms-5"
      >
        Sắp xếp theo thời gian: {sort === "asc" ? "tăng dần" : "giảm dần"}
      </Button>

      <div id="listUsers" className="p-5 panel overflow-auto">
        <Table borderless hover className="shadow-sm">
          <tbody className="rounded-3">
            <tr className="bg-light fs-5 fw-bold">
              <td className="px-3">Tên lớp</td>
              <td className="px-3">Số giảng viên</td>
              <td className="px-3">Số học viên</td>
              <td className="px-3">Hành động</td>
            </tr>
            {resClassList?.map((classroom, id) => {
              return (
                <tr key={id}>
                  <td className="px-3 text-truncate">{classroom?.name}</td>
                  <td className="px-3 text-truncate">
                    {classroom?.teachers?.length}
                  </td>
                  <td className="px-3 text-truncate">
                    {Number(classroom?.students?.length) +
                      Number(classroom?.unmappedStudents?.length)}
                  </td>

                  <td className="px-3">
                    <i
                      className="bi bi-eye-fill fs-3 text-primary cursor-pointer me-3"
                      onClick={() => onShowDetailClass(classroom)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default ClassManagement
