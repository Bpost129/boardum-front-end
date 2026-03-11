import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSortable } from '@dnd-kit/react/sortable'

import TitleForm from '../Form/TitleForm'
import CardDetails from '../CardDetails/CardDetails'

import styles from './Card.module.css'

const Card = ({ card, listId, handleDeleteCard, handleUpdateCard,  id, index }) => {
  // dnd-kit
  const {ref, isDragging} = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
  })
  
  const { boardId } = useParams()
  const [showEditCardForm, setShowEditCardForm] = useState(false)
  const [editFormData, setEditFormData] = useState(card)
  const [showCardDetails, setShowCardDetails] = useState(false)


  const getLabelColor = () => {
    switch (card.label?.color) {
      case 'Red':
        return 'red'
      case 'Blue':
        return 'blue'
      case 'Green':
        return 'green'
      case 'Yellow':
        return 'yellow'
      case 'Orange':
        return 'orange'
      case 'Purple':
        return 'purple'
      default:
        return ''
    }
  }

  // keep local form state in sync if the card prop changes (e.g. list update)
  useEffect(() => {
    setEditFormData(card)
  }, [card])

  const handleSubmitCardForm = e => {
    e.preventDefault()
    setShowEditCardForm(!showEditCardForm)
    if (editFormData && editFormData._id) {
      handleUpdateCard(editFormData, listId, boardId)
    }
  }

  const handleChangeCardForm = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  const closeDetails = () => {
    setShowCardDetails(false)
  }

  return (
    <>
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
            subBtn="Edit Card" 
          />
        }

        {!showEditCardForm &&
        <div className={`${styles.label} ${getLabelColor()}`}>
          <div className={styles.cardMain}>
            <h5 className={styles.cardTitle} onClick={() => setShowEditCardForm(!showEditCardForm)}>{card.title}  </h5>
            <div className={styles.listOptions}>
              <span className={styles.optionsDelete} onClick={() => handleDeleteCard(card._id, listId, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
              <span className={styles.optionsEdit} onClick={() => setShowCardDetails(!showCardDetails)}> <i className="fa-solid fa-pen fa-2xs" ></i> EDIT</span>
            </div>
          </div>
        </div>
        }
      </div>
      {showCardDetails &&
        <CardDetails card={card} closeDetails={closeDetails} handleUpdateCard={handleUpdateCard} boardId={boardId}listId={listId}/>
      }
    </>
  )
}

export default Card