import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { User } from 'models'

const Display = connect(
  ({ storyteller }) => ({storyteller})
)(function StorytellerDisplay ({storyteller}) {
  const s = storyteller
  if (!Object.keys(s).length) return <div>Loading...</div>
  return (
    <div>
      <h2>Storyteller</h2>
      <h3>{s.firstname} {s.lastname}</h3>
      <a href={`https://instagram.com/${s.instagram}/`} target='_blank'>@{s.instagram}</a>
    </div>
  )
})

class Storyteller extends Component {
  constructor (props) {
    super(props)
    User.getStoryteller(props.match.params.userId)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.userId !== this.props.match.params.userId) User.getStoryteller(this.props.match.params.userId)
  }
  render () {
    return <Display />
  }

  componentWillUnmount () {
    // TODO May not be necessary because the call get to a Storyteller
    // always happens on mounting or updating, immediately clearing then
    // Redux store for Storyteller

    this.context.store.dispatch({type: 'CLEAR_STORYTELLER'})
  }
}

Storyteller.contextTypes = {
  store: PropTypes.object
}

export default Storyteller