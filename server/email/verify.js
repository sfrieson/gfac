export default function ({link}) {
  return {
    static: 'Password reset successeful!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Verify Account
      </div>
      <p>
        Finish your account creation by <a href="${link}">verifying your email address</a>. If you did not request this account you can ignore this email.
      </p>
      <p>If you are having trouble clicking the link, copy and paste the below URL into your browser.</p>
      <p>${link}</p>
    </div>
    `
  }
}
