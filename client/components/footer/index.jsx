import React from 'react'

import './styles.scss'

export default function Footer () {
  return (
    <footer className='footer'>
      <div className='footer__top'>
        Made with love in NYC.
      </div>
      <div className='footer__bottom'>
        <ul className='footer__link-list'>
          <li className='footer__link'>Privacy Policy</li>
          <li className='footer__link'>Blog</li>
          <li className='footer__link'>News</li>
          <li className='footer__link'>Events</li>
        </ul>
      </div>
    </footer>
  )
}
