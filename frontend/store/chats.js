import axios from 'axios'

const GET_CHATS = 'GET_CHATS'

const defaultVal = []

const _getChats = chats => ({ type: GET_CHATS, chats })

export const getEmptyChats = () => async dispatch => {
  try {
    const chats = (await axios.get('/api/chats/all')).data
    dispatch(_getChats(chats))
  } catch (ex) {
    console.log(ex)
  }
}

export const getFilledChats = () => async dispatch => {
  try {
    const chats = (await axios.get('/api/chats/all/populated')).data
    dispatch(_getChats(chats))
  } catch (ex) {
    console.log(ex)
  }
}

export default function (state = defaultVal, action) {
  let newState = [...state]
  switch (action.type) {
    case GET_CHATS:
      newState = action.chats
      return newState
    default:
      return state
  }
}
