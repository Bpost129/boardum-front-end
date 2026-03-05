import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useSortable } from '@dnd-kit/react/sortable'

import Card from '../Card/Card'
import TitleForm from '../Form/TitleForm'

import styles from './List.module.css'

const List = ({
  list,
  cards = [],
  handleDeleteList,
  handleUpdateList,
  handleAddCard,
  handleUpdateCard,
  handleDeleteCard,
  id,
  index,
}) => {
  // dnd-kit
  // const {ref} = useSortable({ id, index })
  const { ref } = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.High,
    accept: ['item', 'column'],
    data: {
      index,
    },
  })
  // const style = isDropTarget ? {background: '#00000030'} : undefined

  
  const listId = list._id
  const { boardId } = useParams()
  
  // list
  const [showEditListForm, setShowEditListForm] = useState(false)
  const [editListFormData, setEditListFormData] = useState(list)
  
  // card creation form
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [addCardFormData, setAddCardFormData] = useState({ title: '' })
  
  const getListColor = () => {
    switch (list.color) {
      case 'Red':
        return 'red'
      case 'Blue':
        return 'blue'
      case 'Green':
        return 'green'
      case 'Yellow':
        return 'yellow'
      default:
        return 'black'
    }
  }

  // card service handled by parent component

  // list helper functions
  const handleSubmitListForm = e => {
    e.preventDefault()
    setShowEditListForm(!showEditListForm)
    handleUpdateList(editListFormData, boardId)
  }

  const handleChangeListForm = e => {
    setEditListFormData({ ...editListFormData, [e.target.name]: e.target.value })
  }

  // card helper functions
  const handleSubmitCardForm = e => {
    e.preventDefault()
    setShowAddCardForm(!showAddCardForm)
    handleAddCard(addCardFormData, listId)
    setAddCardFormData({ title: '' })
  }

  const handleChangeCardForm = e => {
    setAddCardFormData({ ...addCardFormData, [e.target.name]: e.target.value })
  }

  // card list is provided by parent; no need to fetch here

  return (
    // ref={ref}
    <div className={`${styles.list} ${getListColor()}`} ref={ref} >
      <div className={styles.listHeader}>
        {showEditListForm && 
          <form className={styles.editForm} onSubmit={handleSubmitListForm}>
            <select name="color" id="color-select" value={editListFormData.color} onChange={handleChangeListForm}>
              <option value="Black">⚫️</option>
              <option value="Red">🔴</option>
              <option value="Blue">🔵</option>
              <option value="Green">🟢</option>
              <option value="Yellow">🟡</option>
            </select>
            <input 
              required
              type="text" 
              name="title"
              id="title-input"
              placeholder={list.title}
              value={editListFormData.title}
              onChange={handleChangeListForm}
            />
            <button className={styles.submitBtn} type="submit">Add List</button>
            <button className={styles.cancelBtn} onClick={() => setShowEditListForm(!showEditListForm)}>X</button>
          </form>
        }

        {!showEditListForm &&
          <>
            <h3>{list.title}  </h3>
            <div className={styles.listOptions}>
              <span className={styles.optionsDelete} onClick={() => handleDeleteList(list._id, boardId)}>
                <i className="fa-regular fa-square-minus"></i> DELETE
              </span>
              <span className={styles.optionsEdit} onClick={() => setShowEditListForm(!showEditListForm)}> 
                <i className="fa-solid fa-pen fa-2xs"></i> EDIT
              </span>
            </div>
          </>
        }
      </div>


        <section className={styles.cards}>
          {cards.map((card, index) =>
            <Card 
              key={card._id} 
              card={card} 
              listId={listId} 
              handleDeleteCard={handleDeleteCard} 
              handleUpdateCard={handleUpdateCard} 
              id={card._id} 
              index={index} 
              list={list} 
            />
          )}

          <div className={styles.addCard}>
            {showAddCardForm && 
              <TitleForm 
                cn={styles.addCardForm} 
                onSub={handleSubmitCardForm} 
                place="Add a title" 
                val={addCardFormData.title} 
                onChan={handleChangeCardForm} 
                show={showAddCardForm} 
                setShow={setShowAddCardForm} 
                subBtn="Add Card"
              />
            }
            {!showAddCardForm && 
              <span onClick={() => setShowAddCardForm(!showAddCardForm)}> 
                <i className="fa-solid fa-plus"></i> <h4>Add Card</h4> 
              </span>
            }
          </div>
        </section>
    </div>
  )
}

export default List