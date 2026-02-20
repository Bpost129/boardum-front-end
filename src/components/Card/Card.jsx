import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSortable } from '@dnd-kit/react/sortable'

import TitleForm from '../Form/TitleForm'

import styles from './Card.module.css'

const Card = ({ card, listId, handleDeleteCard, handleUpdateCard,  id, index, list }) => {
  // dnd-kit
  const {ref, isDragging} = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: list
  })
  
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
    <div className={styles.card} ref={ref} data-dragging={isDragging}>
      {showEditForm && 
        <TitleForm cn={styles.editForm} onSub={handleSubmit} place={card.title} val={editFormData.title} onChan={handleChange} show={showEditForm} setShow={setShowEditForm} />
      }

      {!showEditForm &&
      <>
        <h5>{card.title}  </h5>
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