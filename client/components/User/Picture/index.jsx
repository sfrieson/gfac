import React from 'react'
import PropTypes from 'prop-types'
import './styles.scss'

export default function ProfilePicture ({ url }) {
  return (
    <figure className='user-picture'>
      {url && <img className='user-picture__img' alt='Your profile picture' src={url} />}
    </figure>
  )
}

ProfilePicture.propTypes = {
  url: PropTypes.string
}
