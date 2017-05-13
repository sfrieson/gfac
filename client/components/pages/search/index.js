import React from 'react'
import { connect } from 'react-redux'
import {
  Input
} from 'common'

export default connect(
  ({ searchForm, searchResults }) => ({searchForm, searchResults})
)(function Search ({ searchForm, searchResults }) {
  return (
    <div>
      <Input name='terms' type='text' value={searchForm && searchForm.terms} label='Search' />
    </div>
  )
})
