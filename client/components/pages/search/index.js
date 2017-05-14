import React from 'react'
import { connect } from 'react-redux'
import dispatchAjax from 'utils/ajax-dispatch'
import api from 'utils/api'
import {
  Input
} from 'common'

export default connect(
  ({ searchForm, searchResults }) => ({searchForm, searchResults})
)(function Search ({ searchForm = {}, searchResults, dispatch }) {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input name='firstname' type='text' value={searchForm.firstname || ''} label='First Name' onChange={onChange} />
        <Input name='lastname' type='text' value={searchForm.lastname || ''} label='Last Name' onChange={onChange} />
        <Input name='instagram' type='text' value={searchForm.instagram || ''} label='Instagram Handle' onChange={onChange} />
        <button className='btn'>Submit</button>
      </form>
      <pre><code>
        {JSON.stringify(searchResults, null, 2)}
      </code></pre>
    </div>
  )

  function onSubmit (e) {
    e.preventDefault()
    dispatchAjax('SEARCH', api(`
      query Search ($queries: SearchQueries) {
        search (queries: $queries) {
          firstname
          lastname
          instagram
        }
      }
    `, {queries: Object.assign(searchForm, {role: 'photographer'})}))
  }

  function onChange ({ target }) {
    const change = {}
    change[target.name] = target.value

    dispatch({type: 'SEARCH_UPDATE', change})
  }
})
