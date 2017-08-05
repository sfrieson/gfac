import React from 'react'

export default {
  title: 'Forgot Password | Gramforacause',
  body: function () {
    return (
      <body>
        <h1>Forgot your password?</h1>
        <p>
          Let's see if we can help...
        </p>
        <form action='/forgot-password' method='POST'>
          <label for='email'>Email:</label>
          <input id='email' type='text' name='email' />

          <button className='btn'>Login</button>
        </form>
      </body>
    )
  }
}
