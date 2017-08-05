import React from 'react'
export default function ({name, value, label, checked}) {
  return (
    <label>
      <input name={name} type='checkbox' value={value} checked={checked && 'checked'} />
      {label}
    </label>
  )
}
