import * as tokenService from './tokenService'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/boards`

export async function getAllLists(boardId) {
  try {
      const res = await fetch(`${BASE_URL}/${boardId}/lists`, {
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

export async function createList(listFormData, boardId) {
  try {
    const res = await fetch(`${BASE_URL}/${boardId}/lists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listFormData)
    })
    return await res.json()
  } catch (err) {
    throw new Error(err)
  }
}

export async function updateList(listFormData, boardId) {
  try {
    const res = await fetch(`${BASE_URL}/${boardId}/lists/${listFormData._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listFormData)
    })
    return await res.json()
  } catch (err) {
    throw new Error(err)
  }
}


export async function deleteList(listId, boardId) {
  try {
    const res = await fetch(`${BASE_URL}/${boardId}/lists/${listId}`, {
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