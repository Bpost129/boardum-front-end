import styles from './Card.module.css'

const Card = ({ card }) => {
  return (
    <div className={styles.card}>
      <h4>{card.title}</h4>
    </div>
  )
}

export default Card