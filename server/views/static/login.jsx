import React from 'react'
import config from 'config'

import InputGroup from '../components/InputGroup'
const fields = config.get('client.fields')
const loginFields = config.get('client.fieldsets.login').map(fieldName => fields[fieldName])

export default {
  title: 'Login | Gramforacause',
  head: `
    <style>
      .login__container {
        margin: 0 auto;
        width: 200px;
      }
    </style>
  `,
  body: function () {
    return (
      <div>
        <h1>Welcome to Gramforacause</h1>
        <div className='login__container'>
          <h2>Login!</h2>
          <form action='/login' method='POST'>
            {loginFields.map((data, key) => <InputGroup key={key} {...data} />)}

            <button className='btn'>Login</button>
          </form>

          <a className='btn'href='/register' alt='Create an Account'>
            Create an Account
          </a>
          <a className='btn'href='/forgot-password' alt='Create an Account'>
            Forgot Password?
          </a>
        </div>
      </div>
    )
  }
}
