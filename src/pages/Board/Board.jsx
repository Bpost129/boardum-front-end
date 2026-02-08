import { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'

import { getBoard } from '../../services/boardService'
import { getAllLists } from '../../services/listService'

import styles from './Board.module.css'

const Board = ({ user, profile }) => {
  const [board, setBoard] = useState({})
  const [lists, setLists] = useState([])
  const { boardId } = useParams()

  useEffect(() => {
    const fetchBoard = async () => {
      const boardData = await getBoard(boardId)
      setBoard(boardData)
    }
    fetchBoard()
    .then(() => {
      const fetchLists = async () => {
        const listsData = await getAllLists(boardId)
        setLists(listsData)
      }
      fetchLists()
    })
  }, [boardId])

  return (
    <main className={styles.container}>
      <h1>{board.title}</h1>
      {lists.map(list => 
        <div key={list._id}>
          {list.title}
        </div>
      )}
    </main>
  )
}

export default Board