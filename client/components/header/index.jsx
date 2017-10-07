import React from 'react'
import { NavLink } from 'react-router-dom'

import logo from 'images/logomark-text.png'

import ProfilePicture from 'components/User/Picture'
import Nav from 'components/Nav'

import './styles.scss'

export default function Header () {
  return (
    <header className='header'>
      <div className='header__img'>
        <NavLink to='/'>
          <img src={logo} alt='Gramforacause' />
        </NavLink>
      </div>
      <div>
        <Nav />
      </div>
      <div className='header__profile-picture'>
        <NavLink to='/account'>
          <ProfilePicture />
        </NavLink>
      </div>
    </header>
  )
}
