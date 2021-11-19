import React from "react"
import { Table } from "react-bootstrap"

const GradePage = () => {
  return (
    <div className="mb-5">
      <div className="px-3 py-4">
        <div className="h2 mb-4">Điểm thành phần của lớp học</div>
        <div>
          <Table>
            <tbody className="">
              <tr>
                <th className="py-3">Giữa kì</th>
                <td className="py-3 text-end">35%</td>
              </tr>
              <tr>
                <th className="py-3">Cuối kì</th>
                <td className="py-3 text-end">45%</td>
              </tr>
              <tr>
                <th className="py-3">Bài tập</th>
                <td className="py-3 text-end">5%</td>
              </tr>
              <tr>
                <th className="py-3">Thuyết trình</th>
                <td className="py-3 text-end">15%</td>
              </tr>
              <tr>
                <th className="py-3">Tổng</th>
                <td className="py-3 text-end">100%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <div className="px-3 py-4">
        <div className="h2 mb-4">Bảng điểm của học viên</div>
        <div>
          <Table>
            <tbody>
              <tr className="bg-light">
                <th>Mã số</th>
                <th>Tên học viên</th>
                <th>Điểm giữa kì</th>
                <th>Điểm cuối kì</th>
                <th>Điểm tổng kết</th>
              </tr>
              <tr>
                <td className="py-3">18127156</td>
                <td className="py-3">Mỹ Lê</td>
                <td className="py-3">10/10</td>
                <td className="py-3">10/10</td>
                <td className="py-3">10/10</td>
              </tr>
              <tr>
                <td className="py-3">18127156</td>
                <td className="py-3">Mỹ Lê</td>
                <td className="py-3">10/10</td>
                <td className="py-3">10/10</td>
                <td className="py-3">10/10</td>
              </tr>
              <tr>
                <td className="py-3">18127156</td>
                <td className="py-3">Mỹ Lê</td>
                <td className="py-3">10/10</td>
                <td className="py-3">10/10</td>
                <td className="py-3">10/10</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default GradePage
