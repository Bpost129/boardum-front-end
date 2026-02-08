const BoardCard = ({ board }) => {
  return (
    <div key={board._id}>
      <h3>{board.title}</h3>
    </div>
  )
}

export default BoardCard