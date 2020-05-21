import axios from 'axios'

const defaulVal = []

const GET_CHAT_MESSAGES = 'GET_CHAT_MESSAGES'
const SEND_MESSAGE = 'SEND_MESSAGE'

const _getMessages = chat => ({ type: GET_CHAT_MESSAGES, chat })

//MIGHT NOT NEEDA FUCKING STORE FOR THIS FFS
// either that or keep updating the chats store with messages from each so it doesnt
// have to fetch them everytime you go to the chat

export const getMessagesForChat = (chatId) => async dispatch => {
  try {
    const chat = (await axios.get('/api/chats/single/populate', { chatId })).data
    return dispatch(_getMessages(chat))
  } catch (ex) {
    console.log(ex)
  }
}

// export default function (state = defaultVal, action) {
//   let newState = [...state]
//   switch (action.type) {
//     case GET_CHAT_MESSAGES:
//       newState = action.messages
//       return newState
//     default:
//       return state
//   }
// }
