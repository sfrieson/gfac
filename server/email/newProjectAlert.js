import config from 'config'
const url = config.get('app.url')

export default function ({project: {id, name, description}, nonprofit: {name: nonprofitName}}) {
  return {
    static: 'There\'s a new project!',
    html: `
    <div style="color: #444;">
      <div style="font-weight: bold;">
        Hey Look at that. A new project request!
      </div>
      <p>
        ${nonprofitName} has created a project on the Gramforacause website. Here's some of the information.
      </p>
      <p style="font-size: 2em;">
        <a href="${url}/project/${id}">${name}</a>
      </p>
      <p>
        {description}
      </p>
      <p>If you are having trouble clicking the link, copy and paste the below URL into your browser.</p>
      <p>${url}/project/${id}</p>
    </div>
    `
  }
}
