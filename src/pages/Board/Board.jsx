import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import List from '../../components/List/List'

import { getBoard } from '../../services/boardService'
import { getAllLists } from '../../services/listService'

import styles from './Board.module.css'

const Board = () => {
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
      <div className={styles.board}>
        {lists.map(list => 
          <div key={list._id}>
            {list.title}
          </div>
        )}

      </div>
    </main>
  )
}

export default Board