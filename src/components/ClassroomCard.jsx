import React from "react"
import { Image } from "react-bootstrap"
import { Link } from "react-router-dom"

const ClassroomCard = ({ classroom }) => {
  const renderAvatar = () => (
    <div className="cus-classroom-card__avatar position-relative w-100">
      <div className="cus-classroom-card__avatar__img rounded-circle h-100 bg-white">
        <Image
          src={`/images/default-user-${
            Math.floor(Math.random() * 2) ? "wo" : ""
          }man.png`}
          fluid
          className="rounded-circle"
        />
      </div>
    </div>
  )

  return (
    <div className="cus-classroom-card rounded">
      <Link to={`/c/${classroom._id}`} className="text-decoration-none">
        <div
          className="h-50 w-100 rounded-top border p-3 d-flex flex-column justify-content-between text-white cus-classroom-banner"
          style={{
            backgroundImage: `url(${classroom.banner})`,
            backgroundColor: classroom.themeColor,
          }}
        >
          <div className="text-truncate h3">{classroom?.name}</div>
          <div className="text-truncate cus-host-name-text">
            {classroom?.host?.name}
          </div>
        </div>

        <div className="h-50 bg-white rounded-bottom border border-top-0 p-3 text-secondary">
          <p className="cus-host-name-text">Chưa có sự kiện mới.</p>
        </div>

        {renderAvatar()}
      </Link>
    </div>
  )
}

export default ClassroomCard
