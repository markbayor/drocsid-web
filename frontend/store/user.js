import axios from 'axios'
import history from '../history'
/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
// const REMOVE_USER = 'REMOVE_USER'
/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })

export const auth = (email, password, method) => async dispatch => {
  let user
  try {
    user = (await axios.post(`/auth/${method}`, { email, password })).data
  } catch (authError) {
    return dispatch(getUser({ error: authError }))
  }
  try {
    dispatch(getUser(user))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    const guest = (await axios.post('/auth/guest/retrieve', {
      guestID: window.localStorage.getItem('guestID')
    })).data
    dispatch(getUser(guest))
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
    default:
      return state
  }
}
