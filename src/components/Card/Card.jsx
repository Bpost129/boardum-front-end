import { useParams } from 'react-router-dom'

import styles from './Card.module.css'

const Card = ({ card, listId, handleDeleteCard }) => {
  const { boardId } = useParams()

  return (
    <div className={styles.card}>
      <h4>{card.title}</h4>
      <div className={styles.listOptions}>
        <span className={styles.optionsDelete} onClick={() => handleDeleteCard(card._id,listId, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
        {/* <span className={styles.optionsEdit}> <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i> EDIT</span> */}
      </div>
    </div>
  )
}

export default Card