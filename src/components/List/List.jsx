import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Card from '../Card/Card'

import * as cardService from '../../services/cardService'

import styles from './List.module.css'

const List = ({ list, handleDeleteList, handleUpdateList }) => {
  const listId = list._id
  const { boardId } = useParams()
  
  // list
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState(list)
  
  // cards
  const [cards, setCards] = useState([])
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [addCardFormData, setAddCardFormData] = useState({
    title: ''
  })


  const handleAddCard = async (addCardFormData) => {
      const newCard = await cardService.createCard(addCardFormData, listId, boardId)
      setCards([...cards, newCard])
      // navigate(`/boards/${boardId}`)
    }
  
  //   const handleUpdateList = async (listFormData, boardId) => {
  //     const updatedList = await listService.updateList(listFormData, boardId)
  //     setLists(lists.map(l => updatedList._id === l._id ? updatedList : l))
  //     // navigate(`/boards/${updatedBoard._id}`)
  //   }
  
    const handleDeleteCard = async (cardId, listId, boardId) => {
      const deletedCard = await cardService.deleteCard(cardId, listId, boardId)
      setCards(cards.filter(c => c._id !== deletedCard._id))
      // navigate('/boards/${boardId}')
    }






  // list
  const handleSubmitListForm = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateList(editFormData, boardId)
  }

  const handleChangeListForm = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }


  // cards
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
    <div className={styles.list}>
      <div className={styles.listHeader}>

        {showEditForm && 
        <form className={styles.editForm} onSubmit={handleSubmitListForm}>
          <input 
          required
          type="text" 
          name="title"
          id="title-input"
          placeholder={list.title}
          value={editFormData.title}
          onChange={handleChangeListForm}
          />
          <button onClick={() => setShowEditForm(!showEditForm)}>❌</button>
          <button type="submit">✅</button>
        </form>
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
        {cards.map(card =>
          <Card key={card._id} card={card} listId={listId} handleDeleteCard={handleDeleteCard} />
        )}
        {/* <div className={styles.addCard}>
          <h4><i className="fa-solid fa-plus fa-xs"></i> Add Card</h4>
        </div> */}

        {/*  */}

        <div className={styles.addCard}>
          {showAddCardForm && 
          <form className={styles.addCardForm} onSubmit={handleSubmitCardForm}>
            <input 
            required
            type="text" 
            name="title"
            id="title-input"
            placeholder="Add a title"
            value={addCardFormData.title}
            onChange={handleChangeCardForm}
            />
            <button onClick={() => setShowAddCardForm(!showAddCardForm)}>❌</button>
            <button type="submit">✅</button>
          </form>
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