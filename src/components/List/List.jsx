import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import { useSortable } from '@dnd-kit/react/sortable'


import Card from '../Card/Card'
import TitleForm from '../Form/TitleForm'

import * as cardService from '../../services/cardService'

import styles from './List.module.css'

const List = ({ list, handleDeleteList, handleUpdateList, id, index }) => {
  // dnd-kit
  // const {ref} = useSortable({ id, index })


  const listId = list._id
  const { boardId } = useParams()
  
  // list
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState(list)
  
  // cards
  const [cards, setCards] = useState([])
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [addCardFormData, setAddCardFormData] = useState({
    title: '',
  })

  // card service functions
  const handleAddCard = async (addCardFormData) => {
    const newCard = await cardService.createCard(addCardFormData, listId, boardId)
    setCards([...cards, newCard])
  }

  const handleUpdateCard = async (cardFormData, listId, boardId) => {
    const updatedCard = await cardService.updateCard(cardFormData, listId, boardId)
    setCards(cards.map(c => updatedCard._id === c._id ? updatedCard : c))
  }

  const handleDeleteCard = async (cardId, listId, boardId) => {
    const deletedCard = await cardService.deleteCard(cardId, listId, boardId)
    setCards(cards.filter(c => c._id !== deletedCard._id))
  }

  // list helper functions
  const handleSubmitListForm = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateList(editFormData, boardId)
  }

  const handleChangeListForm = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  // card helper functions
  const handleSubmitCardForm = e => {
    e.preventDefault()
    setShowAddCardForm(!showAddCardForm)
    handleAddCard(addCardFormData)
  }

  const handleChangeCardForm = e => {
    setAddCardFormData({ ...addCardFormData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const fetchCards = async () => {
      const cardsData = await cardService.getAllCards(boardId, listId)
      setCards(cardsData)
    }
    fetchCards()
  }, [listId])

  return (
    // ref={ref}
    <div className={styles.list} >
      <div className={styles.listHeader}>
        {showEditForm && 
          <TitleForm cn={styles.editForm} onSub={handleSubmitListForm} place={list.title} val={editFormData.title} onChan={handleChangeListForm} show={showEditForm} setShow={setShowEditForm} />
        }

        {!showEditForm &&
        <>
          <h3>{list.title}  </h3>
          <div className={styles.listOptions}>
            <span className={styles.optionsDelete} onClick={() => handleDeleteList(list._id, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
            <span className={styles.optionsEdit}> <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i> EDIT</span>
          </div>
        </>
        }
      </div>

      <section className={styles.cards}>
        {cards.map((card, index) =>
          <Card key={card._id} card={card} listId={listId} handleDeleteCard={handleDeleteCard} handleUpdateCard={handleUpdateCard} id={card._id} index={index} list={list} />
        )}

        <div className={styles.addCard}>
          {showAddCardForm && 
            <TitleForm cn={styles.addCardForm} onSub={handleSubmitCardForm} place="Add a title" val={addCardFormData.title} onChan={handleChangeCardForm} show={showAddCardForm} setShow={setShowAddCardForm} />
          }
          {!showAddCardForm && 
          <span onClick={() => setShowAddCardForm(!showAddCardForm)}> <i className="fa-solid fa-plus"></i> <h4>Add Card</h4> </span>
          }
        </div>
      </section>
    </div>
  )
}

export default List