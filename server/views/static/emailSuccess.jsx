import React from 'react'

export default {
  title: 'Email Success | Gramforacause',
  body: function ({email, expiryMin}) {
    return (
      <div>
        <h1>Forgot password</h1>
        <div>
          <p>
            You can close this tab now.
          </p>
          <p>
            An email has been sent to { email || 'you' } with a one-time reset link. That link will expire in { expiryMin } minutes.
          </p>
          {/* TODO Contact us email! */}
          <p>
            If it doesn't come right away, please check your spam folder.  Still no luck? Contact us for help.
          </p>
        </div>
      </div>
    )
  }
}
