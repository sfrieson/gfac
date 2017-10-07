import React from 'react'
import PropTypes from 'prop-types'

import ProfilePicture from 'components/User/Picture'
import './styles.scss'

const block = 'nonprofit-mini'

export default function NonprofitMini ({name, description, primaryContact: { firstname, lastname, role }}) {
  return (
    <div className={block}>
      <div className={`${block}__details`}>
        <span className={`${block}__name`}>{name}</span>
        <p className={`${block}__description`}>{description}</p>
      </div>
      <div className={`${block}__contact`}>
        <ProfilePicture />
        <span>{firstname} {lastname}, {role}</span>
      </div>
    </div>
  )
}

NonprofitMini.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  primaryContact: PropTypes.object.isRequired
}
