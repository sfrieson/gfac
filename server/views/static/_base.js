import headPartial from '../partials/head'
export default function ({body, title = 'Gramforacause', head = ''}) {
  return `
    <!doctype html>
    <html lang="en">
    <head>
      ${headPartial(title)}
      ${head}
    </head>
    <body>
      ${body}
    </body>
    </html>
  `
}
