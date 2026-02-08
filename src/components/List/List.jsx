import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { getAllCards } from '../../services/cardService'

import styles from './List.module.css'

const List = ({ list }) => {
  const listId = list._id
  const { boardId } = useParams()
  const [cards, setCards] = useState([])

  useEffect(() => {
    const fetchCards = async () => {
      const cardsData = await getAllCards(boardId, listId)
      setCards(cardsData)
    }
    fetchCards()
  }, [listId])

  return (
    <div className={styles.list}>
      <h3>{list.title}</h3>
      {cards.map(card =>
        <p key={card._id}>{card.title}</p>
      )}
    </div>
  )
}

export default List