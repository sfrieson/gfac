import React from 'react'
import { connect } from 'react-redux'
import { NavLink as RRNavLink } from 'react-router-dom'
import './styles.scss'

function NavLink (props) {
  return <RRNavLink className='nav__link' activeClassName='nav__link--active' {...props} />
}
export default connect(({me}) => ({me}))(function Nav ({ me }) {
  return (
    <nav className='header col-sm-12 col-md-3'>
      Menu
      <ul className='header'>
        <li><NavLink exact to='/'>Home</NavLink></li>
        <li><NavLink to='/account'>Account</NavLink></li>
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
        <li key='projects'><NavLink to='/project'>Your Projects</NavLink></li>,
        <li key='new project'><NavLink to='/project/new'>New Project</NavLink></li>
      ]
    case 'admin':
      return [
        <li key='projects'><NavLink to='/project'>Projects</NavLink></li>,
        <li key='new project'><NavLink to='/project/new'>New Project</NavLink></li>,
        <li key='search'><NavLink to='/search'>Search</NavLink></li>
      ]
    default:
      return null
  }
}
