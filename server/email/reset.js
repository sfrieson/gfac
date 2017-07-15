export default function (email, link) {
  return {
    static: 'Password reset successeful!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Password Reset
      </div>
      <div>
        Continue through to <a href="${link}">reset your password</a>
      </div>
      <div>If you are having trouble clicking the link, copy and paste this link into your browser.</div>
      <div>${link}</div>
    </div>
    `
  }
}
