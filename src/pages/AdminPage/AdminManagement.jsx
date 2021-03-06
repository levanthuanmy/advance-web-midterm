import React, { useEffect, useState } from "react"
import { Button, FormControl, InputGroup, Table } from "react-bootstrap"
import { useForm } from "react-hook-form"
import Cookies from "universal-cookie/es6"
import { get } from "../../api"
import AdminViewAdminDetail from "../../components/AdminViewAdminDetail"
import CustomSpinner from "../../components/CustomSpinner"
import ModalCreateAdmin from "../../components/ModalCreateAdmin"

const AdminManagement = () => {
  const [token] = useState(new Cookies().get("token"))
  const [resUserList, setResUserList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState("asc")
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowCreateModal, setIsShowCreateModal] = useState(false)
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
      alert(error?.response?.data)
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
      alert(error?.response?.data)
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

      <ModalCreateAdmin
        show={isShowCreateModal}
        onHide={() => setIsShowCreateModal(false)}
        setIsReGet={setIsReGet}
      />

      <div className="mx-5">
        <div className="fs-2 mb-5">Qu???n l?? qu???n tr??? vi??n</div>

        <InputGroup className="mb-3 cus-rounded-dot75rem" size="lg">
          <FormControl
            type="text"
            placeholder="T??m qu???n tr??? vi??n theo t??n"
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
        S???p x???p theo th???i gian: {sort === "asc" ? "t??ng d???n" : "gi???m d???n"}
      </Button>

      <Button
        onClick={() => {
          setIsShowCreateModal(true)
        }}
        className="cus-rounded-dot75rem mt-3 ms-5"
      >
        T???o m???i qu???n tr??? vi??n
      </Button>

      {isLoading ? (
        <CustomSpinner />
      ) : (
        <div id="listUsers" className="p-5 panel overflow-auto">
          <Table borderless hover className="shadow-sm">
            <tbody className="rounded-3">
              <tr className="bg-light fs-5 fw-bold">
                <td className="px-3">T??n ?????y ?????</td>
                <td className="px-3">H??nh ?????ng</td>
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
