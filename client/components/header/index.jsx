import React from 'react'

import './styles.scss'
import logo from 'images/logomark-text.png'

export default function Header () {
  return (
    <header className='header'>
      <div className='header__img'>
        <img src={logo} alt='Gramforacause' />
      </div>
    </header>
  )
}
