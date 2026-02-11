import { useState } from 'react'

import { useParams } from 'react-router-dom'

import styles from './Card.module.css'

const Card = ({ card, listId, handleDeleteCard, handleUpdateCard }) => {
  const { boardId } = useParams()
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState(card)

  const handleSubmit = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateCard(editFormData, listId, boardId)
  }

  const handleChange = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles.card}>
      {/* <h4>{card.title}</h4>
      <div className={styles.listOptions}>
        <span className={styles.optionsDelete} onClick={() => handleDeleteCard(card._id,listId, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
        <span className={styles.optionsEdit}> <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i> EDIT</span>
      </div> */}




      {showEditForm && 
      <form className={styles.editForm} onSubmit={handleSubmit}>
        <input 
        required
        type="text" 
        name="title"
        id="title-input"
        placeholder={card.title}
        value={editFormData.title}
        onChange={handleChange}
        />
        <button onClick={() => setShowEditForm(!showEditForm)}>❌</button>
        <button type="submit">✅</button>
      </form>
      }




      {!showEditForm &&
      <>
        <h3>{card.title}  </h3>
        <div className={styles.listOptions}>
          <span className={styles.optionsDelete} onClick={() => handleDeleteCard(card._id, listId, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
          <span className={styles.optionsEdit}> <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i> EDIT</span>
        </div>
      </>
      }


    </div>
  )
}

export default Card