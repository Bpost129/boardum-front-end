import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { DragDropProvider } from '@dnd-kit/react'
import { Debug } from '@dnd-kit/dom/plugins/debug'

import * as cardService from '../../services/cardService'
import * as listService from '../../services/listService'
import { getBoard } from '../../services/boardService'
import List from '../../components/List/List'
import TitleForm from '../../components/Form/TitleForm'

import styles from './Board.module.css'


const Board = ({ handleUpdateBoard }) => {
  const { state } = useLocation()
  const { boardId } = useParams()
  
  // board
  const [board, setBoard] = useState(null)
  const [showEditBoardForm, setShowEditBoardForm] = useState(false)
  const [editBoardFormData, setEditBoardFormData] = useState(state)
  
  // list
  const [lists, setLists] = useState([])
  const [showAddListForm, setShowAddListForm] = useState(false)
  const [addListFormData, setAddListFormData] = useState({
    title: '',
  })

  // Track the original source during drag operations
  const dragSourceRef = useRef(null)

  // Create a map of cardId -> listId for fast lookup during drag events
  const cardToListMap = {}
  lists.forEach(list => {
    (list.cards || []).forEach(card => {
      cardToListMap[card._id] = list._id
    })
  })

  const handleAddList = async (listFormData) => {
    const newList = await listService.createList(listFormData, boardId)
    setLists([...lists, newList])
  }

  const handleUpdateList = async (listFormData, boardId) => {
    const updatedList = await listService.updateList(listFormData, boardId)
    // preserve the cards array from existing state (backend returns only metadata)
    setLists(lists.map(l =>
      l._id === updatedList._id ? { ...l, ...updatedList, cards: l.cards } : l
    ))
  }

  const handleDeleteList = async (listId, boardId) => {
    const deletedList = await listService.deleteList(listId, boardId)
    setLists(lists.filter(l => l._id !== deletedList._id))
  }

  // card service functions (operate on the lists state)
  const handleAddCard = async (cardFormData, listId) => {
    const newCard = await cardService.createCard(cardFormData, listId, boardId)
    setLists(lists.map(l =>
      l._id === listId
        ? {...l, cards: [...(l.cards || []), newCard]}
        : l
    ))
  }

  const handleUpdateCard = async (cardFormData, listId) => {
    const updatedCard = await cardService.updateCard(cardFormData, listId, boardId)
    setLists(lists.map(l => {
      if (l._id === listId) {
        return {...l, cards: l.cards.map(c => c._id === updatedCard._id ? updatedCard : c)}
      }
      return l
    }))
  }

  const handleDeleteCard = async (cardId, listId) => {
    const deletedCard = await cardService.deleteCard(cardId, listId, boardId)
    setLists(lists.map(l => {
      if (l._id === listId) {
        return {...l, cards: l.cards.filter(c => c._id !== deletedCard._id)}
      }
      return l
    }))
  }


  // dnd-kit logic 

  // Custom reorder function for lists (used during column drag)
  const reorderLists = (event) => {
    const { source, target } = event.operation
    if (!source || !target) return null

    const sourceIndex = source.data?.current?.index ?? lists.findIndex(l => l._id === source.id)
    const targetIndex = target.data?.current?.index ?? lists.findIndex(l => l._id === target.id)

    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return null

    const newLists = [...lists]
    const [movedList] = newLists.splice(sourceIndex, 1)
    newLists.splice(targetIndex, 0, movedList)
    return newLists
  }

  // during card drag we update the nested arrays for a smooth animation
  const moveCardInLists = (event) => {
    const { source, target } = event.operation
    if (!source || source.type !== 'item' || !target) return

    const cardId = source.id
    let originListId = null
    let originIdx = -1
    for (let list of lists) {
      const idx = list.cards?.findIndex(c => c._id === cardId)
      if (idx !== -1) {
        originListId = list._id
        originIdx = idx
        break
      }
    }
    if (!originListId) return

    let destinationListId = null
    let destIndex = 0
    if (target.type === 'item') {
      destinationListId = cardToListMap[target.id]
      // find current index of target card in state (not stale prop index)
      const targetList = lists.find(l => l._id === destinationListId)
      const overIdx = targetList?.cards?.findIndex(c => c._id === target.id) ?? -1
      if (originListId === destinationListId && originIdx != null) {
        // same list: account for removal shifting indices
        if (originIdx < overIdx) {
          destIndex = overIdx - 1
        } else {
          destIndex = overIdx
        }
      } else {
        // different list: insert before target
        destIndex = overIdx
      }
    } else if (target.type === 'column') {
      destinationListId = target.id
      const dest = lists.find(l => l._id === destinationListId)
      destIndex = dest?.cards?.length ?? 0
    }

    if (!destinationListId) return

    setLists(prev => {
      const newLists = prev.map(l => ({ ...l, cards: [...(l.cards || [])] }))
      const fromIdx = newLists.findIndex(l => l._id === originListId)
      const toIdx = newLists.findIndex(l => l._id === destinationListId)
      if (fromIdx === -1 || toIdx === -1) return prev
      const [moved] = newLists[fromIdx].cards.splice(originIdx, 1)
      newLists[toIdx].cards.splice(destIndex, 0, moved)
      return newLists
    })
  }



  // board helper functinons
  const handleSubmitBoardForm = e => {
    e.preventDefault()
    setShowEditBoardForm(!showEditBoardForm)
    handleUpdateBoard(editBoardFormData)
  }

  const handleChangeBoardForm = e => {
    setEditBoardFormData({ ...editBoardFormData, _id: board._id, [e.target.name]: e.target.value })
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

    const fetchListsAndCards = async () => {
      const listsData = await listService.getAllLists(boardId)
      // augment each list with its cards
      const listsWithCards = await Promise.all(
        listsData.map(async (l) => {
          const cards = await cardService.getAllCards(boardId, l._id)
          return {...l, cards}
        })
      )
      setLists(listsWithCards)
    }

    fetchBoard().then(fetchListsAndCards)
  }, [state])

  if (!board) {
    return <main className={styles.container}> <></> </main>
  }

  return (
    <main className={styles.container}>
      {showEditBoardForm && 
        <TitleForm 
          cn={styles.editForm} 
          onSub={handleSubmitBoardForm} 
          place={board.title} 
          val={editBoardFormData.title} 
          onChan={handleChangeBoardForm} 
          show={showEditBoardForm} 
          setShow={setShowEditBoardForm} 
        />
      }

      {!showEditBoardForm && 
        <h1 className={styles.boardTitle}>
          {board.title} <i className="fa-solid fa-pen fa-2xs" onClick={() => setShowEditBoardForm(!showEditBoardForm)}></i>
        </h1>
      }

      <DragDropProvider
        // plugins={(defaults) => [Debug, ...defaults]}
        onDragStart={(event) => {
          const { source } = event.operation
          if (source?.type === 'item') {
            dragSourceRef.current = { cardId: source.id, listId: cardToListMap[source.id], type: 'item' }
          } else if (source?.type === 'column') {
            dragSourceRef.current = { listId: source.id, type: 'column' }
          }
        }}
        onDragOver={(event) => {
          const { source, target } = event.operation

          if (
            source?.type === 'column' &&
            target?.type === 'column' &&
            dragSourceRef.current?.type === 'column'
          ) {
            if (!dragSourceRef.current || dragSourceRef.current.listId !== source.id) {
              dragSourceRef.current = { listId: source.id, type: 'column' }
            }
            const reordered = reorderLists(event)
            if (reordered) {
              setLists(reordered)
            }
            return
          }

          // show card animation when hovering; helps with visual feedback
          if (source?.type === 'item' && (target?.type === 'item' || target?.type === 'column')) {
            moveCardInLists(event)
          }
        }}
        onDragEnd={async (event) => {
          const { source, target } = event.operation

          if (source?.type === 'item') {
            const cardId = source?.id
            const oldListId = dragSourceRef.current?.listId

            if (cardId && oldListId) {
              // determine destination list & index using target info
              let destListId = null
              let destIndex = 0

              if (target?.type === 'item') {
                destListId = cardToListMap[target.id]
                // find current index of target card in state (not stale prop index)
                const targetList = lists.find(l => l._id === destListId)
                const overIdx = targetList?.cards?.findIndex(c => c._id === target.id) ?? -1
                const fromIdx = lists.find(l => l._id === oldListId)
                  ?.cards?.findIndex(c => c._id === cardId)
                
                if (oldListId === destListId && fromIdx != null) {
                  // in same list: account for removal shifting indices
                  if (fromIdx < overIdx) {
                    destIndex = overIdx - 1
                  } else {
                    destIndex = overIdx
                  }
                } else {
                  // different list: insert before target
                  destIndex = overIdx
                }
              } else if (target?.type === 'column') {
                destListId = target.id
                // allow targeting column for top-of-list insertion
                const dest = lists.find(l => l._id === destListId)
                if (oldListId === destListId && dest?.cards?.length > 0) {
                  // same list: default to current position if no item target
                  const fromIdx = dest.cards.findIndex(c => c._id === cardId)
                  destIndex = fromIdx
                } else {
                  // different list or empty: append to end
                  destIndex = dest?.cards?.length ?? 0
                }
              }

              if (destListId) {
                try {
                  const updatedCard = await cardService.updateCard(
                    { _id: cardId, listId: destListId, order: destIndex },
                    oldListId,
                    boardId
                  )
                  
                  // update local state smartly: remove card from old list, add to new list
                  setLists(prev => {
                    const newLists = prev.map(l => ({ ...l }))
                    const fromIdx = newLists.findIndex(l => l._id === oldListId)
                    const toIdx = newLists.findIndex(l => l._id === destListId)
                    
                    if (fromIdx === -1 || toIdx === -1) return prev
                    
                    // remove from old list
                    newLists[fromIdx] = { 
                      ...newLists[fromIdx], 
                      cards: (newLists[fromIdx].cards || []).filter(c => c._id !== cardId)
                    }
                    
                    // remove from new list (in case animation already moved it there) then add at final position
                    newLists[toIdx] = {
                      ...newLists[toIdx],
                      cards: (newLists[toIdx].cards || []).filter(c => c._id !== cardId)
                    }
                    newLists[toIdx].cards.splice(destIndex, 0, updatedCard)
                    
                    return newLists
                  })
                } catch (err) {
                  console.error('Failed to persist card move:', err)
                }
              }
            }
          }

          // Handle list reordering (only if we initiated a column drag)
          if (source?.type === 'column' && dragSourceRef.current?.type === 'column' && target?.type === 'column') {
            try {
              const listOrderUpdates = lists.map((list, idx) => ({
                _id: list._id,
                order: idx + 1
              }))
              await listService.updateListOrder(listOrderUpdates, boardId)
            } catch (err) {
              console.error('Failed to persist list order:', err)
            }
          }

          // Clean up drag source ref
          dragSourceRef.current = null
        }}
      >
        <div className={styles.board}>
          {lists.map((list, index) =>
          <List 
            key={list._id} 
            list={list} 
            cards={list.cards || []}                           // pass card data from parent
            handleDeleteList={handleDeleteList} 
            handleUpdateList={handleUpdateList} 
            handleAddCard={handleAddCard}                       // card handlers
            handleUpdateCard={handleUpdateCard}
            handleDeleteCard={handleDeleteCard}
            id={list._id} 
            index={index} 
          />
          )}
          <div className={styles.addList}>
            {showAddListForm && 
              <TitleForm 
                cn={styles.addListForm} 
                onSub={handleSubmitListForm} 
                place="Add a title" 
                val={addListFormData.title} 
                onChan={handleChangeListForm} 
                show={showAddListForm} 
                setShow={setShowAddListForm} 
              />
            }

            {!showAddListForm && 
              <span className={styles.addListDiv} onClick={() => setShowAddListForm(!showAddListForm)}> 
                <i className="fa-solid fa-plus"></i> <h3>Add List</h3> 
              </span>
            }
          </div>
        </div>
      </DragDropProvider>
    </main>
  )
}

export default Board