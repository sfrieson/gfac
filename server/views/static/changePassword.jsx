import React from 'react'

export default {
  title: 'Change Password | Gramforacause',
  head: `
    <style>
    .login__container {
      margin: 0 auto;
      width: 200px;
    }
    </style>
  `,
  body: function ({token, email}) {
    return (
      <div>
        <h1>Welcome to Gramforacause</h1>
        <div className='login__container'>
          <h2>Change Password</h2>
          <form action='/change-password' method='POST'>
            <input type='hidden' name='token' value={token} />

            <input type='hidden' name='email' value={email} />

            <label for='password'>New Password:</label>
            <input id='password' type='password' name='password' />

            <label for='confirm'>Confirm Password:</label>
            <input id='confirm' type='password' name='confirm' />

            <button className='btn'>Change Password</button>
          </form>
        </div>
      </div>
    )
  }
}
