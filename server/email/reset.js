import config from 'config'

const appUrl = config.get('app.url')

export default function (email, token) {
  return {
    static: 'Password reset successeful!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Password Reset
      </div>
      <div>
        Continue through to  <a href="${appUrl}change-password?t=${token}&email=${email}">reset your password</a>
      </div>
      <div>If you are having trouble clicking the link, copy and paste this link into your browser.</div>
      <div>${appUrl}change-password?t=${token}&email=${email}</div>
    </div>
    `
  }
}
