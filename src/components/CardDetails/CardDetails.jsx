import { useState } from 'react'

import styles from './CardDetails.module.css'

const CardDetails = ({ card, closeDetails, handleUpdateCard, listId, boardId }) => {
  const [editFormData, setEditFormData] = useState(card)

  const handleSubmit = e => {
    e.preventDefault()
    handleUpdateCard(editFormData, listId, boardId)
    closeDetails()
  }

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles.cardDetails}>
      <form className={styles.cardDetailsForm} onSubmit={handleSubmit}>
        <section className={styles.title}>
          <label htmlFor="title-input">Title</label>
          <textarea 
          required
          type="text" 
          name="title"
          id="title-input"
          placeholder={card.title}
          value={editFormData.title}
          onChange={handleChange}
          autoFocus
          />
        </section>
        <section className={styles.menu}>
          <label htmlFor="label-button">
            No Label
            <button className={styles.menuBtn}>Label</button>
          </label>
          <label htmlFor="date-button">
            No Due Date
            <button className={styles.menuBtn}>Due Date</button>
          </label>
          <label htmlFor="image-button">
            No Cover Image
            <button className={styles.menuBtn}>Image</button>
          </label>
        </section>
        <section className={styles.description}>
          <label htmlFor="description-input">Description</label>
          <textarea
            name="description"
            id="description-input"
            placeholder={card.description || 'Add a description...'}
            value={editFormData.description}
            onChange={handleChange}
          />
        </section>
        <section className={styles.formBtns}>
          <button className={styles.submitBtn} type="submit">Save Card</button>
          <button className={styles.cancelBtn} onClick={closeDetails}>X</button>

        </section>
      </form>
    </div>
  )
}

export default CardDetails