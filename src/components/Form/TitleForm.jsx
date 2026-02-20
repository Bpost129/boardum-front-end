const TitleForm = ({ cn, onSub, place, val, onChan, show, setShow }) => {
  return (
    <>
      <form className={cn} onSubmit={onSub}>
        <input 
        required
        type="text" 
        name="title"
        id="title-input"
        placeholder={place}
        value={val}
        onChange={onChan}
        />
        <button onClick={() => setShow(!show)}>❌</button>
        <button type="submit">✅</button>
      </form>
    </>
  )
}

export default TitleForm