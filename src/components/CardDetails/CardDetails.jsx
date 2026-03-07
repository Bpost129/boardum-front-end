import styles from './CardDetails.module.css'

const CardDetails = ({ card, closeDetails }) => {

  const onChange = () => {
    console.log('change')
  }

  return (
    <div className={styles.cardDetails}>
      <form className={styles.cardDetailsForm} onSubmit='submit'>
        <section className={styles.title}>
          <label htmlFor="title-input">Title</label>
          <textarea 
          required
          type="text" 
          name="title"
          id="title-input"
          placeholder={card.title}
          value={card.title}
          onChange={onChange}
          autoFocus
          />
        </section>
        <section className={styles.menu}>
          <button className={styles.menuBtn}>Move</button>
          <button className={styles.menuBtn}>Copy</button>
          <button className={styles.menuBtn}>Delete</button>
        </section>
        <section className={styles.description}>
          <label htmlFor="description-input">Description</label>
          <textarea
            name="description"
            id="description-input"
            placeholder={card.description || 'Add a description...'}
            value={card.description}
            onChange={onChange}
          />
        </section>
        <section className={styles.formBtns}>
          <button className={styles.submitBtn} type="submit">Edit</button>
          <button className={styles.cancelBtn} onClick={closeDetails}>X</button>

        </section>
      </form>
    </div>
  )
}

export default CardDetails