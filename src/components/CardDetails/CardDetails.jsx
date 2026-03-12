import { useState } from 'react'

import styles from './CardDetails.module.css'

const CardDetails = ({ card, closeDetails, handleUpdateCard, listId, boardId, getLabelColor }) => {
  const [editFormData, setEditFormData] = useState(card)
  const [showLabelForm, setShowLabelForm] = useState(false)
  const [showDateForm, setShowDateForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    handleUpdateCard(editFormData, listId, boardId)
    closeDetails()
  }

  const handleSubmitMenuItem = e => {
    e.preventDefault()
    handleUpdateCard(editFormData, listId, boardId)
  }

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles.cardDetails}>
      <form className={styles.cardDetailsForm} onSubmit={handleSubmit}>
        {/* Save and Cancel Buttons */}
        <section className={styles.formBtns}>
          <button className={styles.submitBtn} type="submit">Save Card</button>
          <button className={styles.cancelBtn} onClick={closeDetails}>X</button>
        </section>
        {/* Title Section */}
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
        {/* Description Section */}
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
        {/* Menu Section */}
        <section className={styles.menu}>
          {/* Label Section */}
          <label htmlFor="label-button">
            <span className={styles.menuBtn} onClick={() => setShowLabelForm(!showLabelForm)}>
              Label
            </span>
            {/* Label exists */}
            {card.label && <div className={`${styles.label} ${getLabelColor()}`}>{card.label}</div>}

            {/* No Label exists */}
            {!card.label && 
              !showLabelForm && <div>No Label</div>
            }
            {!card.label && 
              showLabelForm && 

                <div className={styles.menuLabelForm}>
                  <select name="labelColor" id="labelColor-select" value={editFormData.labelColor} onChange={handleChange}>
                    <option value="Red">🔴</option>
                    <option value="Blue">🔵</option>
                    <option value="Green">🟢</option>
                    <option value="Yellow">🟡</option>
                    <option value="Orange">🟠</option>
                    <option value="Purple">🟣</option>
                  </select>
                  <input type="text" name="label" value={editFormData.label} onChange={handleChange} />
                  <button type="submit" onClick={handleSubmitMenuItem}>+</button>
                  
                </div>
            }
          </label>
          {/* Due Date Section */}
          <label htmlFor="date-button">
            <span className={styles.menuBtn}>Due Date</span>
            <div>No Due Date</div>
          </label>
          <label htmlFor="image-button">
            <span className={styles.menuBtn}>Image</span>
            <div>No Cover Image</div>
          </label>
          <label htmlFor="link-button">
            <span className={styles.menuBtn}>Link</span>
            <div>No Link</div>
          </label>
        </section>
        <section className={styles.extras}>
            <div>Label</div>
            <div>Date</div>
            <div>Image</div>
            <div>Link</div>
        </section>
      </form>
    </div>
  )
}

export default CardDetails