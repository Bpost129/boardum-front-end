import * as tokenService from './tokenService'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/boards`

export async function getAllCards(boardId, listId) {
  try {
      const res = await fetch(`${BASE_URL}/${boardId}/lists/${listId}/cards`, {
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

export async function createCard(cardFormData, listId, boardId) {
  try {
    const res = await fetch(`${BASE_URL}/${boardId}/lists/${listId}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cardFormData)
    })
    return await res.json()
  } catch (err) {
    throw new Error(err)
  }
}

export async function deleteCard(cardId, listId, boardId) {
  try {
    const res = await fetch(`${BASE_URL}/${boardId}/lists/${listId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      }
    })
    return await res.json()
  } catch (err) {
    throw new Error(err)
  }
}