import { createStore, combineReducers } from 'redux'

const isDev = process.env.NODE_ENV === 'development'

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

const nonprofit = (state = {}, action) => {
  switch (action.type) {
    case 'CLEAR_NONPROFIT':
    case 'FETCH_NONPROFIT_START':
      return {}
    case 'FETCH_NONPROFIT_END':
      return action.res.data.getNonprofit
    default:
      return state
  }
}
const nonprofits = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_NONPROFITS':
    case 'FETCH_NONPROFITS_START':
      return []
    case 'FETCH_NONPROFITS_END':
      return action.res.data.getNonprofits
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

const storytellers = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL_PHOTOGRAPHERS_START':
      return []
    case 'FETCH_ALL_PHOTOGRAPHERS_END':
      return action.res.data.getAllStorytellers
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
      const {searchStorytellers, searchNonprofits} = action.res.data
      return searchStorytellers || searchNonprofits
    default:
      return state
  }
}

const storyteller = (state = {}, action) => {
  switch (action.type) {
    case 'CLEAR_STORYTELLER':
    case 'FETCH_STORYTELLER_START':
      return {}
    case 'FETCH_STORYTELLER_END':
      return action.res.data.getStoryteller
    default:
      return state
  }
}

const mainReducer = combineReducers({
  fetches,
  me,
  accountForm,
  nonprofit,
  nonprofits,
  nonprofitForm,
  storytellers,
  projectForm,
  projectUpdate,
  projects,
  searchForm,
  searchResults,
  storyteller
})

const store = createStore(
  mainReducer,
  isDev && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
export const dispatch = store.dispatch
