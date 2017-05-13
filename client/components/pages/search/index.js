import React from 'react'
import { connect } from 'react-redux'
import dispatchAjax from 'utils/ajax-dispatch'
import api from 'utils/api'
import {
  Input
} from 'common'

export default connect(
  ({ searchForm, searchResults }) => ({searchForm, searchResults})
)(function Search ({ searchForm = {query: ''}, searchResults, dispatch }) {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input name='query' type='text' value={searchForm.query || ''} label='Search' onChange={onChange} />
        <button className='btn'>Submit</button>
      </form>
    </div>
  )

  function onSubmit (e) {
    e.preventDefault()
    dispatchAjax('SEARCH', api(`
      mutation Search ($query: String) {
        search (query: $query) {
          firstname
          lastname
          instagram
        }
      }
    `, {search: searchForm}))
  }

  function onChange ({ target }) {
    const change = {}
    change[target.name] = target.value

    dispatch({type: 'SEARCH_UPDATE', change})
  }
})
