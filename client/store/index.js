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

const nonprofitForm = function (state = {}, action) {
  switch (action.type) {
    case 'NONPROFIT_FORM_CHANGE':
      return {...state, ...action.change}
    case 'FETCH_NONPROFIT_UPDATE_END':
      return {}
    default:
      return state
  }
}

const projectForm = function (state = {}, action) {
  switch (action.type) {
    case 'PROJECT_FORM_CHANGE':
      return {...state, ...action.change}
    case 'FETCH_CREATE_PROJECT_END':
      return {}
    default:
      return state
  }
}

const ProjectUpdateRE = new RegExp('^PROJECT_UPDATE_(\\d*)')
const projectUpdate = function (state = {}, action) {
  const match = action.type.match(ProjectUpdateRE)
  if (match) {
    const id = match[1]
    const projectState = Object.assign({}, state[id], action.change)
    const newState = {...state}
    newState[id] = projectState
    return newState
  } else return state
}

const projects = function (state = [], action) {
  switch (action.type) {
    case 'FETCH_PROJECTS_END':
      return action.res.data.getProjects
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
    case 'FETCH_CREATE_PROJECT_END':
    case 'FETCH_ME_END':
      return {
        ...state,
        ...action.res
      }
    default:
      return state
  }
}

const mainReducer = combineReducers({fetches, me, accountForm, nonprofitForm, projectForm, projectUpdate, projects})

const middleware = applyMiddleware(logger)
const store = createStore(mainReducer, middleware)

export default store
export const dispatch = store.dispatch
