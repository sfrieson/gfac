import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'

const accountForm = (state = {}, action) => {
  switch (action.type) {
    case 'ACCOUNT_FORM_CHANGE':
      return {...state, ...action.change}
    case 'FETCH_UPDATE_ME_END':
      return {}
    default:
      return state
  }
}

const fetches = (state = {}, action) => {
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

const me = (state = {}, action) => {
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

const nonprofitForm = (state = {}, action) => {
  switch (action.type) {
    case 'NONPROFIT_FORM_CHANGE':
      return {...state, ...action.change}
    case 'FETCH_NONPROFIT_UPDATE_END':
      return {}
    default:
      return state
  }
}

const projectForm = (state = {}, action) => {
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
const projectUpdate = (state = {}, action) => {
  const match = action.type.match(ProjectUpdateRE)
  if (match) {
    const id = match[1]
    const projectState = Object.assign({}, state[id], action.change)
    const newState = {...state}
    newState[id] = projectState
    return newState
  } else return state
}

const projects = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_PROJECTS_END':
      return action.res.data.getProjects
    default:
      return state
  }
}

const searchForm = (state = {}, action) => {
  switch (action.type) {
    case 'SEARCH_UPDATE':
      return {...state, ...action.change}
    default:
      return state
  }
}

const searchResults = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_SEARCH_END':
      return action.res.data.search
    default:
      return state
  }
}

const mainReducer = combineReducers({fetches, me, accountForm, nonprofitForm, projectForm, projectUpdate, projects, searchForm, searchResults})

const middleware = applyMiddleware(logger)
const store = createStore(mainReducer, middleware)

export default store
export const dispatch = store.dispatch
