import React, { useEffect, useState } from "react"
import { Button, FormControl, InputGroup, Table } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie/es6"
import { get } from "../../api"
import AdminViewAdminDetail from "../../components/AdminViewAdminDetail"
import CustomSpinner from "../../components/CustomSpinner"

const AdminManagement = () => {
  const [token] = useState(new Cookies().get("token"))
  const [resUserList, setResUserList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState("asc")
  const [isShowModal, setIsShowModal] = useState(false)
  const [isReGet, setIsReGet] = useState(true)
  const [currentUserId, setCurrentUserId] = useState()
  const { register, handleSubmit } = useForm()

  const onHide = () => {
    setIsShowModal(false)
    setCurrentUserId(null)
  }

  const handleViewUserDetail = (id) => {
    setCurrentUserId(id)
    setIsShowModal(true)
  }

  const getUserList = async () => {
    try {
      setIsLoading(true)

      const res = await get(`/admins?sort=${sort}`, token)

      setResUserList(res)
    } catch (error) {
      console.log("getUserList - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const res = await get(`/admins/search`, token, data)
      console.log("onSubmit - res", res)
      setResUserList(res)
    } catch (error) {
      console.log("onSubmit - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token && isReGet) {
      getUserList()
      setIsReGet(false)
    }
  }, [token, sort, isReGet])

  return (
    <>
      <AdminViewAdminDetail
        show={isShowModal}
        onHide={onHide}
        userId={currentUserId}
      />

      <div className="mx-5">
        <div className="fs-2 mb-5">Quản lý quản trị viên</div>

        <InputGroup className="mb-3 cus-rounded-dot75rem" size="lg">
          <FormControl
            type="text"
            placeholder="Tìm quản trị viên theo tên"
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

      {isLoading ? (
        <CustomSpinner />
      ) : (
        <div id="listUsers" className="p-5 panel overflow-auto">
          <Table borderless hover className="shadow-sm">
            <tbody className="rounded-3">
              <tr className="bg-light fs-5 fw-bold">
                <td className="px-3">Tên đầy đủ</td>
                <td className="px-3">Hành động</td>
              </tr>
              {resUserList?.map((user, id) => {
                return (
                  <tr key={id}>
                    <td className="px-3 text-truncate">{user?.name}</td>

                    <td className="px-3">
                      <i
                        className="bi bi-eye-fill fs-3 text-primary cursor-pointer me-3"
                        onClick={() => handleViewUserDetail(user?._id)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  )
}

export default AdminManagement
