export default (queryString, variables) => {
  const query = {query: queryString}
  if (variables !== undefined) {
    query.variables = variables
  }
  return window.fetch('/api', {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(query)
  }).then(res => res.json())
}
