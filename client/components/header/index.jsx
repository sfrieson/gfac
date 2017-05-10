import React from 'react'
import './styles.scss'
export default function Header () {
  return (
    <header className='header'>
      <div className='header__img'>
        <img src='/images/logo.png' alt='Gramforacause Logo' />
      </div>
      <h1 className='header__title'>Gramforacause</h1>
    </header>
  )
}
