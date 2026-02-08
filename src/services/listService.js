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