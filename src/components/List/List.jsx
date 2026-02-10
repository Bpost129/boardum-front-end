import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Card from '../Card/Card'

import { getAllCards } from '../../services/cardService'

import styles from './List.module.css'

const List = ({ list, handleDeleteList, handleUpdateList }) => {
  const listId = list._id
  const { boardId } = useParams()
  const [cards, setCards] = useState([])


  const [showEditForm, setShowEditForm] = useState(false)
  const [editFormData, setEditFormData] = useState(list)


  const handleSubmitListForm = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateList(editFormData, boardId)
  }

  const handleChangeListForm = e => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }


  useEffect(() => {
    const fetchCards = async () => {
      const cardsData = await getAllCards(boardId, listId)
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
            <span onClick={() => handleDeleteList(list._id, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
            <span> <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i>   </span>
          </div>
        </>
        }
      
      
      
      </div>

      <section>
        {cards.map(card =>
          <Card key={card._id} card={card} />
        )}

      </section>
    </div>
  )
}

export default List