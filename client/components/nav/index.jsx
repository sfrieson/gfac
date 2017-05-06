import React from 'react'

import { NavLink } from 'react-router-dom'
import './styles.scss'

export default function Header () {
  return (
    <div className='header col-sm-12 col-md-3'>
      Menu
      <ul className='header'>
        <li><NavLink className='nav__link' activeClassName='nav__link--active' exact to='/' >Home</NavLink></li>
        <li><NavLink className='nav__link' activeClassName='nav__link--active' to='/account'>Account</NavLink></li>
        <li><NavLink className='nav__link' activeClassName='nav__link--active' to='/project'>Your Projects</NavLink></li>
        <li><NavLink className='nav__link' activeClassName='nav__link--active' to='/project/new'>New Project</NavLink></li>
        <li><a href='/logout'>Logout</a></li>
      </ul>
    </div>
  )
}
