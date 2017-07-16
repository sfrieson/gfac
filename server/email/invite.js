import config from 'config'
const { inviteWeeks } = config.get('server.email')

export default function ({role, link}) {
  return {
    static: 'Password reset successeful!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Invitation to Gramforacause
      </div>
      ${role === 'admin' && `
        <p>
          You have been invited to be an admin on the Gramforacause website. What power!
        </p>
      `}
      ${role === 'contact' && `
        <p>
          You have been invited to be an organization on the Gramforacause website. What power!
        </p>
      `}
      ${role === 'storyteller' && `
        <p>
          You have been invited to be an photographer Storyteller on the Gramforacause website.
        </p>
      `}
      <p>
        Continue through to <a href="${link}">reset your password</a>. This link will expire in ${inviteWeeks} week${inviteWeeks === 1 ? '' : 's'}.
      </p>
      <p>If you are having trouble clicking the link, copy and paste the below URL into your browser.</p>
      <p>${link}</p>
    </div>
    `
  }
}
