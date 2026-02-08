import { NavLink } from "react-router-dom"

const BoardCard = ({ board }) => {
  return (
    <NavLink to={`/boards/${board._id}`}>
      <div key={board._id}>
        <h3>{board.title}</h3>
      </div>
    </NavLink>
  )
}

export default BoardCard