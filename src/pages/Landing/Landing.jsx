import { useState } from 'react'

import BoardCard from '../../components/BoardCard/BoardCard'

import addBoard from '../../assets/addBoard.png'
// css
import styles from './Landing.module.css'

const Landing = ({ user, boards, handleAddBoard, handleDeleteBoard }) => {
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: ''
  })


  const handleSubmit = e => {
    e.preventDefault()
    handleAddBoard(formData)
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDelete = (boardId) => {
    handleDeleteBoard(boardId)
  }

  return (
    <main className={styles.container}>
      <h1>WELCOME TO BOARDUM</h1>
      {!user &&
        <>
          <h3>Sign up (it's free!) or log in to get started!</h3>
        </>
      }

      {user && 
        <>
          <h4 className={styles.caption}>Create a new board from scratch or try out a template</h4>
          <section className={styles.templates}>
            {showAddForm && 
            <div>
              <img className={styles.addImg} src={addBoard} alt="add board icon" />
              <form className={styles.addForm} onSubmit={handleSubmit}>
                <input 
                required
                type="text" 
                name="title"
                id="title-input"
                placeholder="Add title..."
                value={formData.title}
                onChange={handleChange}
                />
                <button onClick={() => setShowAddForm(!showAddForm)}>❌</button>
                <button type="submit">✅</button>
              </form>
            </div>
            }
            {!showAddForm && 
              <div onClick={() => setShowAddForm(!showAddForm)}>
                <img className={styles.addImg} src={addBoard} alt="add board icon" />
                <h3>Create a Board</h3>
              </div>
            }
          </section>
          <h2>Your Boards</h2>
          <section className={styles.userBoards}>
            {boards.map(board => 
              <BoardCard key={board._id} board={board} handleDelete={handleDelete} />
            )}
          </section>
        </>
      }
    </main>
  )
}

export default Landing
