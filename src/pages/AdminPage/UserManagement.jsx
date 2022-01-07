import React, { useEffect } from "react"
import { get } from "../../api"
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap"
import { useState } from "react"
import Cookies from "universal-cookie/es6"
import { useForm } from "react-hook-form"
import AdminViewUserDetail from "../../components/AdminViewUserDetail"

const UserManagement = () => {
  const [token] = useState(new Cookies().get("token"))
  const [resUserList, setResUserList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [sort, setSort] = useState("asc")
  const [isShowModal, setIsShowModal] = useState(false)
  const [isReGet, setIsReGet] = useState(true)
  const [currentUserId, setCurrentUserId] = useState()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

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

      const res = await get(`/admin/list-user?sort=${sort}`, token)

      setResUserList(res)
    } catch (error) {
      console.log("getUserList - error", error)
    } finally {
      setIsLoading(false)
    }
  }

  const banAccount = async (userId) => {
    try {
      const res = await get(`/admin/user/ban-account?id=${userId}`, token)
      console.log("banAccount - res", res)
    } catch (error) {
      console.log("banAccount - error", error)
    } finally {
      setIsReGet(true)
    }
  }

  const lockAccount = async (userId) => {
    try {
      const res = await get(`/admin/user/lock-account?id=${userId}`, token)
      console.log("lockAccount - res", res)
    } catch (error) {
      console.log("lockAccount - error", error)
    } finally {
      setIsReGet(true)
    }
  }

  const unlockAccount = async (userId) => {
    try {
      const res = await get(`/admin/user/unlock-account?id=${userId}`, token)
    } catch (error) {
      console.log("unlockAccount - error", error)
    } finally {
      setIsReGet(true)
    }
  }

  const onSubmit = async (data) => {
    try {
      const res = await get(`/admin/user/search`, token, data)
      console.log("onSubmit - res", res)
      setResUserList(res)
    } catch (error) {
      console.log("onSubmit - error", error)
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
      <AdminViewUserDetail
        show={isShowModal}
        onHide={onHide}
        userId={currentUserId}
      />

      <div className="mx-5">
        <div className="fs-2 mb-5">Quản lý người dùng</div>

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
              <td className="px-3">Mã số</td>
              <td className="px-3">Tên đầy đủ</td>
              <td className="px-3">Email</td>
              <td className="px-3">Trạng thái</td>
              <td className="px-3">Hành động</td>
            </tr>
            {resUserList?.map((user, id) => {
              const isActive = user?.status === "active"
              const isLock = user?.status === "lock"
              return (
                <tr key={id}>
                  <td className="px-3 text-truncate">{user?.studentId}</td>
                  <td className="px-3 text-truncate">{user?.name}</td>
                  <td className="px-3 text-truncate">{user?.email}</td>
                  <td
                    className={`px-3 text-uppercase fw-bold small ${
                      isActive
                        ? `text-success`
                        : isLock
                        ? `text-warning`
                        : `text-danger`
                    }`}
                  >
                    {user?.status}
                  </td>
                  <td className="px-3">
                    <i
                      className={`bi ${
                        isLock ? "bi-unlock-fill" : "bi-lock-fill"
                      } bi-lock-fill fs-3 me-3 cursor-pointer ${
                        isActive || isLock ? `text-primary` : `text-secondary`
                      }`}
                      onClick={() =>
                        isLock
                          ? unlockAccount(user?._id)
                          : lockAccount(user?._id)
                      }
                    />

                    <i
                      className={`bi bi-slash-circle-fill fs-3 ${
                        isActive || isLock ? `text-primary` : `text-secondary`
                      } me-3 cursor-pointer`}
                      onClick={() =>
                        isActive || isLock ? banAccount(user?._id) : null
                      }
                    />

                    <i className="bi bi-pencil-fill fs-3 text-primary cursor-pointer me-3" />

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
    </>
  )
}

export default UserManagement
