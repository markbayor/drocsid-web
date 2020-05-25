import { _sendMessage } from './single_chat'
import { AxiosHttpRequest } from '../utils'

const GET_CHATS = 'GET_CHATS'
const ADD_MESSAGE_TO_CHATS = 'ADD_MESSAGE_TO_CHATS'
const CREATE_TWOPERSON_CHAT = 'CREATE_TWOPERSON_CHAT'
const DELETE_TWOPERSON_CHAT = 'DELETE_TWOPERSON_CHAT'
const defaultVal = []

const _getChats = chats => ({ type: GET_CHATS, chats })
export const _addMessageToChats = data => ({ type: ADD_MESSAGE_TO_CHATS, data })
const _createTwoPersonChat = chat => ({ type: CREATE_TWOPERSON_CHAT, chat })
const _deleteTwoPersonChat = partnerId => ({ type: DELETE_TWOPERSON_CHAT, partnerId })


export const addMessage = (data) => async (dispatch, getState) => {
  try {
    const user = getState().user
    if (user.username === data.username) return // WE DONT WANNA SEND IT TO OURSELVES DO WE?
    const chat = getState().chats.find(chat => chat.id === data.message.chatId)
    const single_chat = getState().single_chat
    if (chat) {
      if (single_chat.id === data.message.chatId) {
        return dispatch(_sendMessage(data))
      } else {
        return dispatch(_addMessageToChats(data))
      }
    }
  } catch (ex) {
    console.log(ex)
  }
}

export const getEmptyChats = () => async dispatch => {
  try {
    const chats = (await AxiosHttpRequest('GET', '/api/chats/all')).data
    dispatch(_getChats(chats))
  } catch (ex) {
    console.log(ex)
  }
}

export const getFilledChats = () => async dispatch => {
  try {
    const chats = (await AxiosHttpRequest('GET', '/api/chats/all/populated')).data
    dispatch(_getChats(chats))
  } catch (ex) {
    console.log(ex)
  }
}

export const createTwoPersonChat = (partnerId) => async dispatch => {
  try {
    const chat = (await AxiosHttpRequest('POST', `/api/chats/single/new`, { partnerId })).data
    dispatch(_createTwoPersonChat(chat))
  } catch (ex) {
    console.log(ex)
  }
}

export const deleteTwoPersonChat = (partnerId) => async dispatch => {
  try {
    await AxiosHttpRequest('DELETE', `/api/chats/single/${partnerId}`)
    dispatch(_deleteTwoPersonChat(partnerId))
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
    case ADD_MESSAGE_TO_CHATS:
      action.data.message.user = {}
      action.data.message.user.username = action.data.username
      const chatIdx = newState.findIndex(chat => chat.id === action.data.message.chatId)
      newState[chatIdx].messages = [...newState[chatIdx].messages, action.data.message]
      return newState
    case CREATE_TWOPERSON_CHAT:
      newState = [...newState, action.chat]
      return newState
    case DELETE_TWOPERSON_CHAT:
      const chatId = (newState.find(chat => chat.userIds.includes(action.partnerId))).id
      newState = newState.filter(chat => chat.id !== chatId)
      return newState
    default:
      return state
  }
}
