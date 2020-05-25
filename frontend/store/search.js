import { AxiosHttpRequest } from '../utils'

const defaultVal = { show: false, results: [] }

const GET_RESULTS = 'GET_RESULTS'
const SET_SHOW_SEARCH = 'SET_SHOW_SEARCH'

const _setShowSearchComponent = bool => ({ type: SET_SHOW_SEARCH, bool })
const _getResults = results => ({ type: GET_RESULTS, results })

export const loadSearchResults = (searchVal) => async dispatch => { // search confirms we clicked search and not just returns results for searchbar
  try {
    const users = (await AxiosHttpRequest('POST', '/api/friends/search', { searchVal })).data
    return dispatch(_getResults(users))
  } catch (ex) {
    console.log(ex)
  }
}

export const setShowSearchComponent = bool => async dispatch => dispatch(_setShowSearchComponent(bool))

export default function (state = defaultVal, action) {
  let newState = { ...state }
  switch (action.type) {
    case GET_RESULTS:
      newState.results = action.results
      return newState
    case SET_SHOW_SEARCH:
      newState.show = action.bool
      return newState
    default:
      return state
  }
}