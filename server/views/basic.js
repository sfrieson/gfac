import headTemplate from './head'
export default function ({body, title, head, scripts = true}) {
  return `
    <!doctype html>
    <html lang="en">
    <head>
      ${headTemplate(title, head)}
    </head>
    <body>
      <div id="app">${body}</div>
      ${scripts ? '<script src="/scripts.js"></script>' : ''}
    </body>
    </html>
`
}
