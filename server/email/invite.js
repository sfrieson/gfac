import config from 'config'
const { inviteWeeks } = config.get('server.email')

export default function ({role, link, nonprofit}) {
  return {
    static: 'Password reset successeful!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Invitation to Gramforacause
      </div>
      ${role === 'admin' && `
        <p>
          You have been invited to be an admin on Gramforacause. What power!
        </p>
      `}
      ${role === 'contact' && `
        <p>
          You have been invited to manage ${nonprofit} on Gramforacause.
        </p>
      `}
      <p>
        Continue through to <a href="${link}">claim your account</a>. This invitation will expire in ${inviteWeeks} week${inviteWeeks === 1 ? '' : 's'}.
      </p>
      <p>If you are having trouble clicking the link, copy and paste the below URL into your browser.</p>
      <p>${link}</p>
    </div>
    `
  }
}
