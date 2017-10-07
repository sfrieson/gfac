import React from 'react'
import { connect } from 'react-redux'
import { NavLink as RRNavLink } from 'react-router-dom'
import './styles.scss'

function NavLink (props) {
  return <RRNavLink className='nav__link' activeClassName='nav__link--active' {...props} />
}
function Item (props) {
  return <li className='nav__item' {...props} />
}

export default connect(({me}) => ({me}))(function Nav ({ me }) {
  return (
    <nav>
      <ul className='nav__list'>
        {roleSpecificLinks(me.role)}
        <Item>
          <a className='nav__link' href='/logout'>Logout</a>
        </Item>
      </ul>
    </nav>
  )
})

function roleSpecificLinks (role) {
  switch (role) {
    case 'contact':
      return [
        <Item key='projects'><NavLink to='/projects'>Your Projects</NavLink></Item>,
        <Item key='new project'><NavLink to='/project/new'>New Project</NavLink></Item>
      ]
    case 'storyteller':
      return [
        <Item key='projects'><NavLink to='/projects'>Your Projects</NavLink></Item>
      ]
    case 'admin':
      return [
        <Item key='projects'><NavLink to='/projects'>Projects</NavLink></Item>,
        <Item key='new project'><NavLink to='/project/new'>New Project</NavLink></Item>,
        <Item key='search'><NavLink to='/search'>Search</NavLink></Item>
      ]
    default:
      return null
  }
}
