import styles from './TitleForm.module.css'

const TitleForm = ({ cn, onSub, place, val, onChan, show, setShow, subBtn }) => {
  return (
    <>
      <form className={cn} onSubmit={onSub}>
        <textarea 
        required
        type="text" 
        name="title"
        id="title-input"
        placeholder={place}
        value={val}
        onChange={onChan}
        autoFocus
        />
        <section className={styles.formBtns}>
          <button className={styles.submitBtn} type="submit">{subBtn}</button>
          <button className={styles.cancelBtn} onClick={() => setShow(!show)}>X</button>

        </section>
      </form>
    </>
  )
}

export default TitleForm