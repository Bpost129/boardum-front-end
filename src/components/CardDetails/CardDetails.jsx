import { useState } from 'react'

import styles from './CardDetails.module.css'

const CardDetails = ({ card, closeDetails, handleUpdateCard, listId, boardId }) => {
  const [editFormData, setEditFormData] = useState(card)
  const [showLabel, setShowLabel] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [showLink, setShowLink] = useState(false)

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
            <span className={styles.menuBtn} onClick={() => setShowLabel(!showLabel)}>
              Label
            </span>
            {card.label && 
              !showLabel && <div>{card.label}</div>
            }
            {card.label && 
              showLabel && 
                <select name="label" id="color-select" value={editFormData.label} onChange={handleChange}>
                  <option value="">No Label</option>
                  <option value="Red">🔴</option>
                  <option value="Blue">🔵</option>
                  <option value="Green">🟢</option>
                  <option value="Yellow">🟡</option>
                  <option value="Orange">🟠</option>
                  <option value="Purple">🟣</option>
                </select>
            }


            {!card.label && 
              !showLabel && <div>No Label</div>
            }
            {!card.label && 
              showLabel && 

                <div className={styles.menuLabelForm}>
                  <select name="label" id="color-select" value={editFormData.label?.color} onChange={handleChange}>
                    <option value="Red">🔴</option>
                    <option value="Blue">🔵</option>
                    <option value="Green">🟢</option>
                    <option value="Yellow">🟡</option>
                    <option value="Orange">🟠</option>
                    <option value="Purple">🟣</option>
                  </select>
                  <input type="text" name="label" value={editFormData.label?.text} onChange={handleChange} />
                </div>
            }
          </label>
          <label htmlFor="date-button">
            <span className={styles.menuBtn}>Due Date</span>
            No Due Date
          </label>
          <label htmlFor="image-button">
            <span className={styles.menuBtn}>Image</span>
            No Cover Image
          </label>
          <label htmlFor="link-button">
            <span className={styles.menuBtn}>Link</span>
            No Link
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