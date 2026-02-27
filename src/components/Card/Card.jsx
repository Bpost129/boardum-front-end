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
  const [showEditCardForm, setShowEditCardForm] = useState(false)
  const [editFormData, setEditFormData] = useState(card)

  const handleSubmitCardForm = e => {
    e.preventDefault()
    setShowEditCardForm(!showEditCardForm)
    handleUpdateCard(editFormData, listId, boardId)
  }

  const handleChangeCardForm = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles.card} ref={ref} data-dragging={isDragging}>
      {showEditCardForm && 
        <TitleForm 
          cn={styles.editForm} 
          onSub={handleSubmitCardForm} 
          place={card.title} 
          val={editFormData.title} 
          onChan={handleChangeCardForm} 
          show={showEditCardForm} 
          setShow={setShowEditCardForm} 
        />
      }

      {!showEditCardForm &&
        <>
          <h5>{card.title}  </h5>
          <div className={styles.listOptions}>
            <span className={styles.optionsDelete} onClick={() => handleDeleteCard(card._id, listId, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
            <span className={styles.optionsEdit}> <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditCardForm(!showEditCardForm)}></i> EDIT</span>
          </div>
        </>
      }
    </div>
  )
}

export default Card