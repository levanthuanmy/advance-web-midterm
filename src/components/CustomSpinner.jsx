import React from "react"
import { Spinner } from "react-bootstrap"

const CustomSpinner = () => {
  return (
    <div className="mt-5 d-flex justify-content-center">
      <div className="bg-white shadow rounded-circle d-flex justify-content-center align-items-center cus-spinner">
        <Spinner variant="secondary" animation="border" />
      </div>
    </div>
  )
}

export default CustomSpinner
