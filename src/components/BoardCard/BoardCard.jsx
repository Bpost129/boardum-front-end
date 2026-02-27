import { NavLink } from "react-router-dom"

import styles from './BoardCard.module.css'

const BoardCard = ({ board, handleDelete }) => {
  return (
    <NavLink to={`/boards/${board._id}`} state={board}>
      <div key={board._id} className={styles.boardCard}>
        <span onClick={() => handleDelete(board._id)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
        <h3>{board.title}</h3>
      </div>
    </NavLink>
  )
}

export default BoardCard