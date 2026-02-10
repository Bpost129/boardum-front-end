import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import List from '../../components/List/List'

import { getBoard } from '../../services/boardService'
import { getAllLists } from '../../services/listService'

import styles from './Board.module.css'

const Board = ({ handleUpdateBoard }) => {
  const { state } = useLocation()
  const { boardId } = useParams()

  // board
  const [board, setBoard] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [updateFormData, setUpdateFormData] = useState(state)
  
  // list
  const [lists, setLists] = useState([])

  

  const handleSubmitBoardForm = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateBoard(updateFormData)
  }

  const handleChangeBoardForm = e => {
    setUpdateFormData({ ...updateFormData, _id: board._id, [e.target.name]: e.target.value })
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
  }, [state])

  if (!board) {
    return <main className={styles.container}> <></> </main>
  }

  return (
    <main className={styles.container}>
      {showEditForm && 
      <form className={styles.editForm} onSubmit={handleSubmitBoardForm}>
        <input 
        required
        type="text" 
        name="title"
        id="title-input"
        placeholder={board.title}
        value={updateFormData.title}
        onChange={handleChangeBoardForm}
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
        <div className={styles.addList}>
          <span> <i className="fa-solid fa-plus"></i> <h3>Add List</h3> </span>
        </div>
      </div>
    </main>
  )
}

export default Board