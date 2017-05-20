import React from 'react'
import { connect } from 'react-redux'
import dispatchAjax from 'utils/ajax-dispatch'
import api from 'utils/api'
import { Link } from 'react-router-dom'
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
        <div style={{fontWeight: 'bold'}}>Shoots with:</div>
        <Input name='cameraDSLR' type='checkbox' value={searchForm.cameraDSLR || ''} label='DSLR' onChange={onChange} />
        <Input name='cameraPhone' type='checkbox' value={searchForm.cameraPhone || ''} label='Phone' onChange={onChange} />
        <Input name='cameraFilm' type='checkbox' value={searchForm.cameraFilm || ''} label='Film' onChange={onChange} />
        <button className='btn'>Submit</button>
      </form>
      {searchResults.length > 0 && renderResults(searchResults)}
    </div>
  )

  function renderResults (results) {
    const items = results.map(r => (
      <li key={r.instagram}><Link to={`/storyteller/${r.id}`}>{`${r.firstname} ${r.lastname} (@${r.instagram})`}</Link></li>
    ))

    return (
      <div>
        <h3>Results</h3>
        <ul>
          {items}
        </ul>
      </div>
    )
  }
  function onSubmit (e) {
    e.preventDefault()
    dispatchAjax('SEARCH', api(`
      query Search ($queries: SearchQueries) {
        search (queries: $queries) {
          id
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
