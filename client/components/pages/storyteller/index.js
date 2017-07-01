import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { User } from 'models'

import { Availability } from '../../common'

const Display = connect(
  ({ storyteller }) => ({storyteller})
)(function StorytellerDisplay ({storyteller}) {
  const s = storyteller
  if (!Object.keys(s).length) return <div>Loading...</div>
  return (
    <div>
      <h2>Storyteller</h2>
      <h3>{s.firstname} {s.lastname}</h3>
      <h4>Info</h4>
      <ul>
        {s.portfolio && <li><a href={s.portfolio} target='_blank'>Portfolio</a></li>}
        <li><a href={`https://instagram.com/${s.instagram}/`} target='_blank'>
          @{s.instagram}{s.preferredContactMethod === 'instagram' && ' - preferred'}
        </a></li>
        {s.phone && <li><a href={`tel:${s.phone}`} target='_blank'>
          {s.phoneType}: {s.phone}{s.preferredContactMethod === 'phone' && ' - preferred'}
        </a></li>}
        {s.email && <li><a href={`mailto:${s.email}`} target='_blank'>
          {s.email}{s.preferredContactMethod === 'email' && ' - preferred'}
        </a></li>}
      </ul>

      <h4>Cause Interests</h4>
      <ul>
        {s.causes.map((c, i) => <li key={c.name}>{c.name}</li>)}
      </ul>

      <h4>Availability</h4>
      <Availability values={s.availabilities} />
      <h4>Projects</h4>
      {renderProjects(s.projects)}

    </div>
  )
})

function renderProjects (projects) {
  return (
    <ul>
      {projects.map(p => (
        <li key={p.id}>
          {p.name} - {p.date}
        </li>
      ))}
    </ul>
  )
}

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
