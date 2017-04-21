export default (queryString) => {
  return fetch('/api', {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      query: queryString
    })
  }).then(res => res.json())
}