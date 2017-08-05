import React from 'react'
export default function ({label, name, options, value: radioValue}) {
  return (
    <div>
      <div>Phone Type</div>
      {options.map(({label, value}, key) => <RadioButton key={key} name={name} label={label} value={radioValue === value} />)}
    </div>
  )
}

function RadioButton ({name, label, value, selected}) {
  return (
    <div className='radio'>
      <label>
        <input name={name} type='radio' value={value} aria-label={label} selected={selected && 'selected'} />
        {label}
      </label>
    </div>
  )
}
