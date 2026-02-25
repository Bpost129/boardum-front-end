import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useSortable } from '@dnd-kit/react/sortable'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import {Debug} from '@dnd-kit/dom/plugins/debug';


import Card from '../Card/Card'
import TitleForm from '../Form/TitleForm'

import * as cardService from '../../services/cardService'

import styles from './List.module.css'

const List = ({ list, handleDeleteList, handleUpdateList, id, index }) => {
  // dnd-kit
  // const {ref} = useSortable({ id, index })
  const {isDropTarget, ref} = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: ['item', 'column']
  })
  const style = isDropTarget ? {background: '#00000030'} : undefined


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
    <div className={styles.list} ref={ref} style={style}>
      <div className={styles.listHeader}>
        {showEditForm && 
          <TitleForm cn={styles.editForm} onSub={handleSubmitListForm} place={list.title} val={editFormData.title} onChan={handleChangeListForm} show={showEditForm} setShow={setShowEditForm} />
        }

        {!showEditForm &&
        <>
          <h3>{list.title}  </h3>
          <div className={styles.listOptions}>
            <span className={styles.optionsDelete} onClick={() => handleDeleteList(list._id, boardId)}><i className="fa-regular fa-square-minus"></i> DELETE</span>
            <span className={styles.optionsEdit} onClick={() => setShowEditForm(!showEditForm)}> <i className="fa-solid fa-pen fa-2xs"></i> EDIT</span>
          </div>
        </>
        }
      </div>


      <DragDropProvider

        plugins={(defaults) => [Debug, ...defaults]}
        onDragOver={(event) => {
          const {source, target} = event.operation;
          console.log(`${source.id} is over ${target.id}`);
          if (source?.type === 'item') return;

          setCards((cards) => move(cards, event));
        }}
      >
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

      </DragDropProvider>


    </div>
  )
}

export default List