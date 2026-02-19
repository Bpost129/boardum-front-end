import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { DragDropProvider } from '@dnd-kit/react'



import List from '../../components/List/List'
import Form from '../../components/Form/Form'

import { getBoard } from '../../services/boardService'
import * as listService from '../../services/listService'

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
  const [showAddListForm, setShowAddListForm] = useState(false)
  const [addListFormData, setAddListFormData] = useState({
    title: ''
  })
  
  
  const handleAddList = async (listFormData) => {
    const newList = await listService.createList(listFormData, boardId)
    setLists([...lists, newList])
    // navigate(`/boards/${boardId}`)
  }

  const handleUpdateList = async (listFormData, boardId) => {
    const updatedList = await listService.updateList(listFormData, boardId)
    setLists(lists.map(l => updatedList._id === l._id ? updatedList : l))
    // navigate(`/boards/${updatedBoard._id}`)
  }

  const handleDeleteList = async (listId, boardId) => {
    const deletedList = await listService.deleteList(listId, boardId)
    setLists(lists.filter(l => l._id !== deletedList._id))
    // navigate('/boards/${boardId}')
  }
  

  // board
  const handleSubmitBoardForm = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateBoard(updateFormData)
  }

  const handleChangeBoardForm = e => {
    setUpdateFormData({ ...updateFormData, _id: board._id, [e.target.name]: e.target.value })
  }

  // list
  const handleSubmitListForm = e => {
    e.preventDefault()
    setShowAddListForm(!showAddListForm)
    handleAddList(addListFormData)
  }

  const handleChangeListForm = e => {
    setAddListFormData({ ...addListFormData, [e.target.name]: e.target.value })
  }





  
  useEffect(() => {
    const fetchBoard = async () => {
      const boardData = await getBoard(boardId)
      setBoard(boardData)
    }
    fetchBoard()
    .then(() => {
      const fetchLists = async () => {
        const listsData = await listService.getAllLists(boardId)
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
        <Form cn={styles.editForm} onSub={handleSubmitBoardForm} place={board.title} val={updateFormData.title} onChan={handleChangeBoardForm} show={showEditForm} setShow={setShowEditForm} />
      }
      {!showEditForm && 
      <h1>{board.title} <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i></h1>
      }
      
      <div className={styles.board}>

        <DragDropProvider
          onDragStart={({source}) => {
            console.log('Started dragging', source.id);
          }}
          onDragMove={({operation}) => {
            const {position} = operation;
            console.log('Current position:', position);
          }}
          onDragOver={({source, target}) => {
            console.log(`${source.id} is over ${target.id}`);
          }}
          onDragEnd={({source, target}) => {
            if (target) {
              console.log(`Dropped ${source.id} onto ${target.id}`);
            }
          }}
        >
          {lists.map((list, index) =>
          <>
              <List key={list._id} list={list} handleDeleteList={handleDeleteList} handleUpdateList={handleUpdateList} id={list._id} index={index} /> 
          </>
          )}

        </DragDropProvider>


        <div className={styles.addList}>
          {showAddListForm && 
            <Form cn={styles.addListForm} onSub={handleSubmitListForm} place="Add a title" val={addListFormData.title} onChan={handleChangeListForm} show={showAddListForm} setShow={setShowAddListForm} />
          }
          {!showAddListForm && 
          <span className={styles.addListDiv} onClick={() => setShowAddListForm(!showAddListForm)}> <i className="fa-solid fa-plus"></i> <h3>Add List</h3> </span>
          }
        </div>
      </div>
    </main>
  )
}

export default Board