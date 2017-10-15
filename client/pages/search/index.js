import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

import dispatchAjax from 'utils/ajax-dispatch'
import api from 'utils/api'
import Input from 'components/Input'

const arr = []

export default connect(
  ({ searchForm, searchResults }) => ({searchForm, searchResults})
)(function Search ({ searchForm = {}, searchResults, dispatch }) {
  const {
    search, cameraDSLR, cameraPhone, cameraFilm, availabilities, interests, queryType = 'searchStorytellers'
  } = searchForm
  const typeOptions = [
    {label: 'Storytellers', value: 'searchStorytellers'},
    {label: 'Nonprofits', value: 'searchNonprofits'}
  ]
  const isStoryteller = queryType === 'searchStorytellers'
  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input name='queryType' type='radio' value={queryType} label='Search Type' onChange={onChange} options={typeOptions} />
        <Input name='search' type='text' value={search || ''} label='Search' onChange={onChange} />
        <Input name='interests' type='causes' value={interests || arr} label='Interests' onChange={onChange} />

        {isStoryteller && <div style={{fontWeight: 'bold'}}>Shoots with:</div>}
        {isStoryteller && <Input name='cameraDSLR' type='checkbox' value={cameraDSLR || false} label='DSLR' onChange={onChange} />}
        {isStoryteller && <Input name='cameraPhone' type='checkbox' value={cameraPhone || false} label='Phone' onChange={onChange} />}
        {isStoryteller && <Input name='cameraFilm' type='checkbox' value={cameraFilm || false} label='Film' onChange={onChange} />}
        {isStoryteller && <Input name='availabilities' type='availability' value={availabilities || arr} label='Availability' onChange={onChange} />}
        <Button type='primary'>Submit</Button>
      </form>
      {searchResults.length > 0 && renderResults(searchResults)}
    </div>
  )

  function renderResults (results) {
    let items
    if ('instagram' in results[0]) {
      items = results.map(r => (
        <li key={r.instagram}><Link to={`/storyteller/${r.id}`}>{`${r.firstname} ${r.lastname} (@${r.instagram})`}</Link></li>
      ))
    } else {
      items = results.map(r => (
        <li key={r.id}><Link to={`/nonprofit/${r.id}`}>{`${r.name}`}</Link></li>
      ))
    }

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
    let queries = `${search}`

    if (queryType === 'searchStorytellers') {
      queries += ' ' + (availabilities || arr).join(' ')

      if (cameraDSLR) queries += ' DSLR'
      if (cameraPhone) queries += ' phone'
      if (cameraFilm) queries += ' film'
    }

    ;(interests || []).forEach(id => { queries += ' cause_' + id })

    dispatchAjax('SEARCH', api(`
      query Search ($queries: String) {
        ${queryType} (queries: $queries) {
          id
          ${queryType === 'searchStorytellers' ? `
            firstname
            lastname
            instagram
          ` : ''}
          ${queryType === 'searchNonprofits' ? `
            name
          ` : ''}
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
