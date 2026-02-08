import { NavLink } from "react-router-dom"

const BoardCard = ({ board, handleDelete }) => {
  return (
    <NavLink to={`/boards/${board._id}`}>
      <div key={board._id}>
        <span onClick={() => handleDelete(board._id)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
        <h3>{board.title}</h3>
      </div>
    </NavLink>
  )
}

export default BoardCard