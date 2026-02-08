import BoardCard from '../../components/BoardCard/BoardCard'

// css
import styles from './Landing.module.css'

const Landing = ({ user, boards }) => {

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
            <div>
              <h3>template</h3>
            </div>
          </section>
          <h2>Your Boards</h2>
          <section className={styles.userBoards}>
            {boards.map(board => 
              <BoardCard key={board._id} board={board} />
            )}
          </section>
        </>
      }
    </main>
  )
}

export default Landing
