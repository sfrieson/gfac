import React from 'react'

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
            <label for='email'>Email:</label>
            <input id='email' type='text' name='email' />

            <label for='password'>Password:</label>
            <input id='password' type='password' name='password' />

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
