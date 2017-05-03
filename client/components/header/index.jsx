import React from 'react'

import { NavLink } from 'react-router-dom'
import './styles.scss'

export default function Header () {
  return (
    <div className='header col-sm-12 col-md-3'>
      Menu
      <ul className='header'>
        <li><NavLink className='header__link' activeClassName='header__link--active' exact to='/' >Home</NavLink></li>
        <li><NavLink className='header__link' activeClassName='header__link--active' to='/account'>Account</NavLink></li>
        <li><NavLink className='header__link' activeClassName='header__link--active' to='/project'>New Project</NavLink></li>
        <li><a href='/logout'>Logout</a></li>
      </ul>
    </div>
  )
}
