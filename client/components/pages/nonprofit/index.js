import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Nonprofit as Model } from 'models'

const Display = connect(
  ({ nonprofit }) => ({nonprofit})
)(function NonprofitDisplay ({nonprofit}) {
  const np = nonprofit || {}
  if (!Object.keys(np).length) return <div>Loading...</div>
  return (
    <div>
      <h2>Nonprofit</h2>
      <h3>{np.name}</h3>
      <p>{np.description}</p>
      {np.contacts.length > 0 && <h4>Contacts</h4>}
      {np.contacts.length > 0 && <ul>{np.contacts.map((c, i) => <li key={i}>{c.firstname} {c.lastname}</li>)}</ul>}

      {np.causes.length > 0 && <h4>Causes</h4>}
      {np.causes.length > 0 && <ul>{np.causes.map(c => <li key={c.id}>{c.name}</li>)}</ul>}

      {np.projects.length > 0 && <h4>Projects</h4>}
      {np.projects.length > 0 && <ul>{np.projects.map(p => <li key={p.id}><a href={'/projects/' + p.id}>{p.name}</a></li>)}</ul>}
    </div>
  )
})

class Nonprofit extends Component {
  constructor (props) {
    super(props)
    Model.get(props.match.params.id)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) Model.get(this.props.match.params.id)
  }
  render () {
    return <Display />
  }

  componentWillUnmount () {
    // TODO May not be necessary because the call get to a Nonprofit
    // always happens on mounting or updating, immediately clearing then
    // Redux store for Nonprofit

    this.context.store.dispatch({type: 'CLEAR_NONPROFIT'})
  }
}

Nonprofit.contextTypes = {
  store: PropTypes.object
}

export default Nonprofit
