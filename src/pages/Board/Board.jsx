import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import List from '../../components/List/List'

import { getBoard } from '../../services/boardService'
import { getAllLists } from '../../services/listService'

import styles from './Board.module.css'

const Board = ({ handleUpdateBoard }) => {
  const { state } = useLocation()

  const [board, setBoard] = useState({})
  const [lists, setLists] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [updateFormData, setUpdateFormData] = useState(state)
  const { boardId } = useParams()

  const handleSubmit = e => {
    e.preventDefault()
    handleUpdateBoard(updateFormData)
  }

  const handleChange = e => {
    setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value })
  }
  
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
      {showEditForm && 
      <form className={styles.editForm} onSubmit={handleSubmit}>
        <input 
        required
        type="text" 
        name="title"
        id="title-input"
        placeholder={board.title}
        value={updateFormData.title}
        onChange={handleChange}
        />
        <button onClick={() => setShowEditForm(!showEditForm)}>❌</button>
        <button type="submit">✅</button>
      </form>
      }
      {!showEditForm && 
      <h1>{board.title} <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i></h1>
      }
      <div className={styles.board}>
        {lists.map(list =>
          <List key={list._id} list={list} /> 
        )}

      </div>
    </main>
  )
}

export default Board