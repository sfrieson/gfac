import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'

const accountForm = function (state = {}, action) {
  switch (action.type) {
    case 'ACCOUNT_FORM_CHANGE':
      return {...state, ...action.change}
    case 'FETCH_UPDATE_ME_END':
      return {}
    default:
      return state
  }
}

const fetches = function (state = {}, action) {
  if (!/^FETCH_/.test(action.type)) return state
  switch (action.type) {
    case 'FETCH_USER_END':
      return {
        ...state,
        me: action.res
      }
    default:
      return state
  }
}

const me = function (state = {}, action) {
  switch (action.type) {
    case 'FETCH_UPDATE_ME_END':
    case 'FETCH_ME_END':
      return {
        ...state,
        ...action.res
      }
    default:
      return state
  }
}

const mainReducer = combineReducers({fetches, me, accountForm})

const middleware = applyMiddleware(logger)
const store = createStore(mainReducer, middleware)

export default store
export const dispatch = store.dispatch
