import head from './partials/head'
export default function () {
  return `
  <!doctype html>
  <html lang="en">
  <head>
    ${head('Gramforacause')}
  </head>
  <body>
    <div id="app">Loading...</div>
    <script src="/scripts.js"></script>
  </body>
  </html>
  `
}
