import axios from 'axios'

const defaultVal = {}

const GET_CHAT = 'GET_CHAT'
const SEND_MESSAGE = 'SEND_MESSAGE'


const _getChat = chat => ({ type: GET_CHAT, chat })
const _sendMessage = message => ({ type: SEND_MESSAGE, message })

export const getPopulatedChat = (chatId) => async dispatch => {
  try {
    const chat = (await axios.post('/api/chats/single/populated', { chatId })).data
    console.log('POPULATE CHAT THUNK', chat)
    dispatch(_getChat(chat))
  } catch (ex) {
    console.log(ex)
  }
}

export const sendMessageToChat = (chatId, text) => async dispatch => {
  try {
    const message = (await axios.post('/api/messages/new', { chatId, text })).data
    return dispatch(_sendMessage(message))
  } catch (ex) {
    console.log(ex)
  }
}


export default function (state = defaultVal, action) {
  let newState = { ...state }
  switch (action.type) {
    case GET_CHAT:
      newState = action.chat
      return newState
    case SEND_MESSAGE:
      newState.messages = [...newState.messages, message]
      return newState
    default:
      return state
  }
}
