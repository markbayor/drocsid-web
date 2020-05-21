import axios from 'axios'

const GET_CHATS = 'GET_CHATS'
const POPULATE_CHAT = 'POPULATE_CHAT'

const defaultVal = []

const _populateChat = chat => ({ type: POPULATE_CHAT, chat })
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

export const populateChat = (chatId) => async dispatch => {
  try {
    const chat = (await axios.post('/api/chats/single/populate', { chatId })).data
    console.log('POPULATE CHAT THUNK', chat)
    dispatch(_populateChat(chat))
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
    case POPULATE_CHAT:
      newState = newState.map(chat => chat.id === action.chat.id ? action.chat : chat)
      return newState
    default:
      return state
  }
}
