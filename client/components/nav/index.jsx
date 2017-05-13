import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './styles.scss'

export default connect(({me}) => ({me}))(function Nav ({ me }) {
  return (
    <nav className='header col-sm-12 col-md-3'>
      Menu
      <ul className='header'>
        <li><NavLink className='nav__link' activeClassName='nav__link--active' exact to='/' >Home</NavLink></li>
        <li><NavLink className='nav__link' activeClassName='nav__link--active' to='/account'>Account</NavLink></li>
        {roleSpecificLinks(me.role)}
        <li><a href='/logout'>Logout</a></li>
      </ul>
    </nav>
  )
})

function roleSpecificLinks (role) {
  switch (role) {
    case 'contact':
      return [
        <li key='projects'><NavLink className='nav__link' activeClassName='nav__link--active' to='/project'>Your Projects</NavLink></li>,
        <li key='new project'><NavLink className='nav__link' activeClassName='nav__link--active' to='/project/new'>New Project</NavLink></li>
      ]
    case 'admin':
      return <li key='search'><NavLink className='nav__link' activeClassName='nav__link--active' to='/search'>Search</NavLink></li>
    default:
      return null
  }
}
