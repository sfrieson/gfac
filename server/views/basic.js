import headTemplate from './head'
export default function ({body, title, head}) {
  return `
    <!doctype html>
    <html lang="en">
    <head>
      ${headTemplate(title, head)}
    </head>
    <body>
      <div id="app">${body}</div>
      <script src="/scripts.js"></script>
    </body>
    </html>
`
}
