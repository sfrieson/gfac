import config from 'config'
const { expiryMin } = config.get('server.email')

export default function ({link}) {
  return {
    static: 'Password reset successeful!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Password Reset
      </div>
      <p>
        Continue through to <a href="${link}">reset your password</a>. This link will expire in ${expiryMin} minutes.
      </p>
      <p>If you are having trouble clicking the link, copy and paste the below URL into your browser.</p>
      <p>${link}</p>
    </div>
    `
  }
}
