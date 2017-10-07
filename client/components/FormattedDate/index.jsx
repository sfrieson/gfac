import React from 'react'
export default function formattedDate ({ raw }) {
  const formatted = new Date(raw).toLocaleString(navigator.language, {month: 'long', day: 'numeric', year: 'numeric'})
  return <time dateTime={raw}>{formatted}</time>
}
