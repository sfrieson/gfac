import React from 'react'
export default function InputGroup ({name, label, value, type}) {
  return (
    <div className='input-group'>
      <label for={name}>{label}</label>
      <input name={name} type={type} id={name} className='form-control' defaultValue={value} />
    </div>
  )
}
