import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import chats from './chats'
import friends from './friends'
import single_chat from './single_chat'
import search from './search'

const reducer = combineReducers({
  user,
  chats,
  friends,
  single_chat,
  search
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
)

const store = createStore(reducer, middleware)

export default store
export * from './user'
