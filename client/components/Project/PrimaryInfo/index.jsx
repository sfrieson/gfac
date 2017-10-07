import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const block = 'project-primary-info'
export default function PrimaryInfo ({ name, date, location }) {
  return (
    <div className={block}>
      <h1 className={`${block}__name`}>{name}</h1>
      <div className={`${block}__date`}>{new Date(date).toLocaleDateString()}</div>
      <div className={`${block}__location`}>{location}</div>
    </div>
  )
}

PrimaryInfo.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string,
  location: PropTypes.string
}
