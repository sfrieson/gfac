import React from 'react'
import PropTypes from 'prop-types'

import ProfilePicture from '../Picture'

import './styles.scss'

const block = 'user-mini'
export default function UserMini ({firstname, lastname, type, url}) {
  return (
    <div className={block}>
      <div className={`${block}__picture`}>
        <ProfilePicture url={url} />
      </div>
      <span className={`${block}__details`}>
        {firstname} {lastname}, {type}
      </span>
    </div>
  )
}

UserMini.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  url: PropTypes.string
}
