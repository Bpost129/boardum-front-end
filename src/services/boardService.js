import * as tokenService from './tokenService'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/boards`

export async function getAllBoards() {
  try {
    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
    })
    return await res.json()
  } catch (err) {
    throw new Error(err)
  }
}

export async function getBoard(boardId) {
  try {
    const res = await fetch(`${BASE_URL}/${boardId}`, {
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    })
    return await res.json()
  } catch (err) {
    throw new Error(err)
  }
}

export async function createBoard(boardFormData) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(boardFormData)
    })
    return res.json()
  } catch (err) {
    throw new Error(err)
  }
}
