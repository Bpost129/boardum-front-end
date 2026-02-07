import { useState, useEffect } from 'react'

import { getAllBoards } from '../../services/boardService'

// css
import styles from './Landing.module.css'

const Landing = ({ user }) => {
  const [boards, setBoards] = useState([])

  useEffect(() => {
    const fetchBoards = async () => {
      const boardsData = await getAllBoards()
      setBoards(boardsData)
    }
    fetchBoards()
  }, [])

  return (
    <main className={styles.container}>
      <h1>WELCOME TO BOARDUM</h1>
      <h4 className={styles.caption}>Create a new board from scratch or try out a template</h4>
      <section className={styles.templates}>
        {boards.map(board => 
          <div key={board._id}>
            <h3>{board.title}</h3>
          </div>
        )}
      </section>
    </main>
  )
}

export default Landing
