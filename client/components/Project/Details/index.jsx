import React from 'react'
import PropTypes from 'prop-types'

import './styles.scss'

const block = 'project-details'
export default function Details ({description}) {
  return (
    <div className={block}>
      <p className={`${block}__description`}>{description}</p>
    </div>
  )
}

Details.propTypes = {
  description: PropTypes.string
}
