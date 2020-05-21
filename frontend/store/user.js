import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })
const removeUser = () => ({ type: REMOVE_USER })

export const signup = (username, email, password) => async dispatch => {
  let user
  try {
    user = (await axios.post(`/auth/signup`, { username, email, password })).data
  } catch (authError) {
    return dispatch(getUser({ error: authError }))
  }
  try {
    dispatch(getUser(user))
    history.push('/chats')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const login = (email, password) => async dispatch => {
  let user
  try {
    user = (await axios.post(`/auth/login`, { email, password })).data
  } catch (authError) {
    return dispatch(getUser({ error: authError }))
  }
  try {
    dispatch(getUser(user))
    history.push('/chats')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/')
  } catch (err) {
    console.error(err)
  }
}


export const me = () => async dispatch => {
  let res
  try {
    res = await axios.get('/auth/me')
    //console.log('getting me', res.data)
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      state = action.user
      return state
    case REMOVE_USER:
      state = defaultUser
      return state
    default:
      return state
  }
}
