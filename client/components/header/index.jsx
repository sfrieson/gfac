import React from 'react'
import './styles.scss'
import logo from 'images/logo.png'

export default function Header () {
  return (
    <header className='header'>
      <div className='header__img'>
        <img src={logo} alt='Gramforacause Logo' />
      </div>
      <h1 className='header__title'>Gramforacause</h1>
    </header>
  )
}
