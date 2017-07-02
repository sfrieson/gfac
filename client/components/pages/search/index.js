import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import dispatchAjax from 'utils/ajax-dispatch'
import api from 'utils/api'
import {
  Input
} from 'common'

const arr = []

export default connect(
  ({ searchForm, searchResults }) => ({searchForm, searchResults})
)(function Search ({ searchForm = {}, searchResults, dispatch }) {
  const {
    search, cameraDSLR, cameraPhone, cameraFilm, availabilities, interests
  } = searchForm
  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input name='search' type='text' value={search || ''} label='Search' onChange={onChange} />
        <div style={{fontWeight: 'bold'}}>Shoots with:</div>
        <Input name='cameraDSLR' type='checkbox' value={cameraDSLR || false} label='DSLR' onChange={onChange} />
        <Input name='cameraPhone' type='checkbox' value={cameraPhone || false} label='Phone' onChange={onChange} />
        <Input name='cameraFilm' type='checkbox' value={cameraFilm || false} label='Film' onChange={onChange} />
        <Input name='interests' type='causes' value={interests || arr} label='Interests' onChange={onChange} />
        <Input name='availabilities' type='availability' value={availabilities || arr} label='Availability' onChange={onChange} />
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
    let queries = `${search} ${(availabilities || arr).join(' ')}`
    if (cameraDSLR) queries += ' DSLR'
    if (cameraPhone) queries += ' phone'
    if (cameraFilm) queries += ' film'

    ;(interests || []).forEach(id => { queries += ' cause-' + id })

    dispatchAjax('SEARCH', api(`
      query Search ($queries: String) {
        search (queries: $queries) {
          id
          firstname
          lastname
          instagram
        }
      }
    `, {queries}))
  }

  function onChange ({ target }) {
    const change = {}
    change[target.name] = target.value

    dispatch({type: 'SEARCH_UPDATE', change})
  }
})
