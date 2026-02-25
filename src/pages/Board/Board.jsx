import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import {Debug} from '@dnd-kit/dom/plugins/debug';

import List from '../../components/List/List'
import TitleForm from '../../components/Form/TitleForm'

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
    title: '',
  })
  const [listOrder, setListOrder] = useState(lists)
  
  // list service functions
  const handleAddList = async (listFormData) => {
    const newList = await listService.createList(listFormData, boardId)
    setLists([...lists, newList])
  }

  const handleUpdateList = async (listFormData, boardId) => {
    const updatedList = await listService.updateList(listFormData, boardId)
    setLists(lists.map(l => updatedList._id === l._id ? updatedList : l))
  }

  const handleDeleteList = async (listId, boardId) => {
    const deletedList = await listService.deleteList(listId, boardId)
    setLists(lists.filter(l => l._id !== deletedList._id))
  }

  // board helper functinons
  const handleSubmitBoardForm = e => {
    e.preventDefault()
    setShowEditForm(!showEditForm)
    handleUpdateBoard(updateFormData)
  }

  const handleChangeBoardForm = e => {
    setUpdateFormData({ ...updateFormData, _id: board._id, [e.target.name]: e.target.value })
  }

  // list helper functions
  const handleSubmitListForm = e => {
    e.preventDefault()
    setShowAddListForm(!showAddListForm)
    handleAddList(addListFormData)
    setAddListFormData({ title: '' })
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
        <TitleForm cn={styles.editForm} onSub={handleSubmitBoardForm} place={board.title} val={updateFormData.title} onChan={handleChangeBoardForm} show={showEditForm} setShow={setShowEditForm} />
      }

      {!showEditForm && 
      <h1>{board.title} <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditForm(!showEditForm)}></i></h1>
      }
      

      <DragDropProvider
        plugins={(defaults) => [Debug, ...defaults]}

        onDragOver={(event) => {
          const {source, target} = event.operation;
          console.log(`${source.id} is over ${target.id}`);
          if (source?.type === 'column') return;

          setLists((lists) => move(lists, event));
        }}
        onDragEnd={(event) => {
          const {source, target} = event.operation;
          if (target) {
            console.log(`Dropped ${source.id} onto ${target.id}`);
          }
          if (event.canceled || source.type !== 'column') return;

          setListOrder((lists) => move(lists, event));
        }}  
      >
        <div className={styles.board}>

          {lists.map((list, index) =>
            <List key={list._id} list={list} handleDeleteList={handleDeleteList} handleUpdateList={handleUpdateList} id={list._id} index={index} /> 
          )}

          <div className={styles.addList}>
            {showAddListForm && 
              <TitleForm cn={styles.addListForm} onSub={handleSubmitListForm} place="Add a title" val={addListFormData.title} onChan={handleChangeListForm} show={showAddListForm} setShow={setShowAddListForm} />
            }

            {!showAddListForm && 
            <span className={styles.addListDiv} onClick={() => setShowAddListForm(!showAddListForm)}> <i className="fa-solid fa-plus"></i> <h3>Add List</h3> </span>
            }
          </div>
        </div>

      </DragDropProvider>



    </main>
  )
}

export default Board