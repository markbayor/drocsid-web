import { AxiosHttpRequest } from '../utils'

const defaultVal = {}

const GET_CHAT = 'GET_CHAT'
const SEND_MESSAGE = 'SEND_MESSAGE'

const _getChat = chat => ({ type: GET_CHAT, chat })
export const _sendMessage = (data) => ({ type: SEND_MESSAGE, data })


export const getPopulatedChat = (chatId, partnerId) => async dispatch => {
  try {
    const chat = (await AxiosHttpRequest('POST', '/api/chats/single/populated', { chatId, partnerId })).data
    dispatch(_getChat(chat))
  } catch (ex) {
    console.log(ex)
  }
}

export const sendMessageToChat = (chatId, text, username) => async dispatch => {
  try {
    const data = (await AxiosHttpRequest('POST', '/api/messages/new', { chatId, text, username })).data
    return dispatch(_sendMessage(data))
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
      newState.messages = [...newState.messages, action.data.message]
      return newState
    default:
      return state
  }
}
