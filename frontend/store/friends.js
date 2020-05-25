import { AxiosHttpRequest } from '../utils'



const defaultVal = { friends: [], incomingRequests: [], sentRequests: [] }

const GET_FRIENDS = 'GET_FRIENDS'
const SEND_REQUEST = 'SEND_REQUEST'
const DELETE_FRIEND = 'DELETE_FRIEND'

const GET_REQUESTS = 'GET_REQUESTS'
const ACCEPT_REQUEST = 'ACCEPT_REQUEST'
const REJECT_REQUEST = 'REJECT_REQUEST'
const CANCEL_REQUEST = 'CANCEL_REQUEST'

const _getFriends = friends => ({ type: GET_FRIENDS, friends })
const _sendRequest = request => ({ type: SEND_REQUEST, request })
const _deleteFriend = friendId => ({ type: DELETE_FRIEND, friendId })

const _getRequests = (incomingRequests, sentRequests) => ({ type: GET_REQUESTS, incomingRequests, sentRequests })
const _acceptRequest = friend => ({ type: ACCEPT_REQUEST, friend })
const _rejectRequest = requesterId => ({ type: REJECT_REQUEST, requesterId })
const _cancelRequest = friendId => ({ type: CANCEL_REQUEST, friendId })

export const getFriends = () => async dispatch => {
  try {
    const friends = (await AxiosHttpRequest('GET', '/api/friends')).data
    return dispatch(_getFriends(friends))
  } catch (ex) {
    console.log(ex)
  }
}

export const sendRequest = (id, username) => async dispatch => {
  try {
    if (id) {
      const requested = (await AxiosHttpRequest('POST', '/api/friends/requests/add', { friendId: id })).data
      return dispatch(_sendRequest(requested))
    } else {
      const requested = (await AxiosHttpRequest('POST', '/api/friends/requests/add', { friendUsername: username })).data
      return dispatch(_sendRequest(requested))
    }
  } catch (ex) {
    console.log(ex)
  }
}

export const deleteFriend = (friendId) => async dispatch => {
  try {
    await AxiosHttpRequest('DELETE', `/api/friends/requests/reject/${friendId}`)
    return dispatch(_deleteFriend(friendId))
  } catch (ex) {
    console.log(ex)
  }
}


export const getRequests = () => async dispatch => {
  try {
    const { incomingRequests, sentRequests } = (await AxiosHttpRequest('GET', '/api/friends/requests')).data
    return dispatch(_getRequests(incomingRequests, sentRequests))
  } catch (ex) {
    console.log(ex)
  }
}

export const acceptRequest = (id) => async dispatch => {
  try {
    const friend = (await AxiosHttpRequest('POST', '/api/friends/requests/accept', { requesterId: id })).data
    console.log('FRIEND IN THUNK', friend)
    return dispatch(_acceptRequest(friend))
  } catch (ex) {
    console.log(ex)
  }
}

export const rejectRequest = (requesterId) => async dispatch => {
  try {
    await AxiosHttpRequest('DELETE', `/api/friends/requests/reject/${requesterId}`)
    return dispatch(_rejectRequest(requesterId))
  } catch (ex) {
    console.log(ex)
  }
}

export const cancelRequest = (friendId) => async dispatch => {
  try {
    await AxiosHttpRequest('DELETE', `/api/friends/requests/cancel/${friendId}`)
    return dispatch(_cancelRequest(friendId))
  } catch (ex) {
    console.log(ex)
  }
}


export default function (state = defaultVal, action) {
  let newState = { ...state }
  switch (action.type) {
    case GET_FRIENDS:
      newState.friends = action.friends
      return newState
    case SEND_REQUEST:
      newState.sentRequests = [...newState.sentRequests, action.request]
      return newState
    case DELETE_FRIEND:
      newState.friends = newState.friends.filter(friend => friend.id !== action.friendId)
      return newState
    case GET_REQUESTS:
      newState.incomingRequests = action.incomingRequests
      newState.sentRequests = action.sentRequests
      return newState
    case ACCEPT_REQUEST:
      newState.friends = [...newState.friends, action.friend.friend]
      newState.incomingRequests = newState.incomingRequests.filter(request => request.id !== action.friend.friend.id)
      return newState
    case REJECT_REQUEST:
      newState.incomingRequests = newState.incomingRequests.filter(request => request.id !== action.requesterId)
      return newState
    case CANCEL_REQUEST:
      newState.sentRequests = newState.sentRequests.filter(request => request.id !== action.friendId)
      return newState
    default:
      return newState
  }
}
