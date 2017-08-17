import React from 'react'
import PropTypes from 'prop-types'
import { fields } from 'client-config'

export default function Input (props) {
  const {
    onChange,
    label,
    name,
    type = 'text',
    value
  } = props

  if (type === 'date') return <DateInput {...props} />
  if (type === 'radio') return <Radio {...props} />
  if (type === 'hidden') return <input {...props} />
  if (type === 'causes') return <Checkboxes {...props} options={fields.causes.options} />
  if (type === 'select') return <Select {...props} />
  if (type === 'textarea') return <TextArea {...props} />
  if (type === 'checkbox') return <Checkbox {...props} />
  if (type === 'checkboxes') return <Checkboxes {...props} />
  if (type === 'availability') return <Availability {...props} />

  return (
    <div className='form-group'>
      <label htmlFor={name}>{label}</label>
      <input className='form-control' name={name} id={name} value={value} onChange={onChange} type={type} />
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.oneOf(['availability', 'causes', 'checkbox', 'checkboxes', 'date', 'email', 'hidden', 'number', 'radio', 'select', 'text', 'tel', 'textarea']),
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.bool])
}

Input.defaultProps = {
  onChange: () => {},
  type: 'text'
}

// ----------
// Date Input
// ----------

function DateInput ({ label, name, value, ...props }) {
  return (
    <div className='input-group'>
      <label htmlFor={name}>{label}</label>
      <input id={`${name}-input`}
        className='form-control'
        name={name} {...props}
        type='datetime-local'
        min={getDate()}
        value={getDate(value)}
      />
    </div>
  )

  function getDate (when = Date.now()) {
    const d = new Date(when)
    const date = {
      year: d.toLocaleString('en-US', {year: 'numeric'}),
      month: d.toLocaleString('en-US', {month: '2-digit'}),
      day: d.toLocaleString('en-US', {day: '2-digit'}),
      hour: d.getHours(),
      minute: d.getMinutes()
    }
    if (date.hour < 10) date.hour = '0' + date.hour
    if (date.minute < 10) date.minute = '0' + date.minute

    return `${date.year}-${date.month}-${date.day}T${date.hour}:${date.minute}`
  }
}
// -----------
// Radio Input
// -----------

function Radio (props) {
  const {
    options,
    onChange,
    label,
    name,
    value
  } = props

  const checked = value
  // TODO check on hardcoded 'role' below
  return (
    <div className='input-group'>
      <label htmlFor='role'>{label}</label>
      {renderButtons(options)}
    </div>
  )

  function renderButtons (buttons) {
    return buttons.map(({ value, label }) => (
      <div key={value} className='radio'>
        <label>
          <input type='radio' name={name} value={value} checked={value === checked} onChange={onChange} />
          {label}
        </label>
      </div>
    ))
  }
}

// ------------
// Select Input
// ------------

function Select (props) {
  const {
    options,
    onChange,
    label,
    name,
    value
  } = props

  return (
    <div className='input-group'>
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} className='form-control' value={value} onChange={onChange}>
        <option disabled>Please select one...</option>
        {renderOptions(options)}
      </select>
    </div>
  )

  function renderOptions (opts) {
    return opts.map(({ label, value }) => {
      return (
        <option key={value} value={value}>{label}</option>
      )
    })
  }
}

// --------------
// TextArea Input
// --------------

function TextArea ({ label, rows = 3, ...props }) {
  return (
    <div className='form-group'>
      <label htmlFor='nonprofit_description'>{label}</label>
      <textarea {...props} className='form-control' rows={rows} />
    </div>
  )
}
// --------------
// Checkbox Input
// --------------

// <Input type='checkbox' label='Film' name="cameraFilm" checked={false} onChange={updateFn} />

function Checkbox ({ checked, label, onChange, value, ...props }) {
  let checkedValue = checked // Coming from Checkboxes
  if (checkedValue === undefined) checkedValue = value // Made directly with Checkbox
  return (
    <div className='checkbox'>
      <label>
        <input type='checkbox' {...props} onChange={normalizeChange} checked={checkedValue} />{label}
      </label>
    </div>
  )

  function normalizeChange ({ name, target }) {
    onChange({
      target: {
        name: target.name,
        value: target.checked
      }
    })
  }
}

// ----------------
// Checkboxes Input
// ----------------

/*  Example with global name

*   <Input type='checkboxes' label='Causes' name='causes'
*     values={[1]}
*     options={[
*       {label: 'Education', value: '1'},
*       {label: 'Health', value: '2'}
*     ]}
*   />
*
*
*   Example with check-specific names
*
*   <Input type='checkboxes' label='How do you take pictures'
*     values={['cameraDSLR', 'cameraPhone']}
*     options={[
*       {label: 'Phone', name: 'cameraPhone'},
*       {label: 'DSLR', name: 'cameraDSLR'},
*       {label: 'Film', name: 'cameraFilm'},
*     ]}
*     />
* */
function Checkboxes (props) {
  const {
    options,
    onChange,
    label,
    name,
    value
  } = props

  const sameName = name
  const values = value
  return (
    <div className='checkbox'>
      <div style={{fontWeight: 'bold'}}>{label}</div>
      {renderChecks(options)}
    </div>
  )

  function renderChecks (checks) {
    return checks.map(({label, name, value}) => {
      return (
        <label key={`${name}_${value}`}>
          <input name={name || sameName}
            type='checkbox'
            onChange={handleChange}
            checked={values.indexOf(name || value) > -1}
            value={value}
          />{label}
        </label>
      )
    })
  }

  function handleChange ({ target }) {
    let newCheckboxesValue
    let value = target.value
    if (/^\d*$/.test(value)) value = +value

    if (target.checked) {
      newCheckboxesValue = [...values, value]
    } else {
      newCheckboxesValue = [
        ...values.slice(0, values.indexOf(value)),
        ...values.slice(values.indexOf(value) + 1)
      ]
    }

    onChange({
      target: {
        name,
        value: newCheckboxesValue
      }
    })
  }
}

function Availability ({ value, onChange }) {
  const availabilities = value

  function handleChange ({ target }) {
    let newAvailabilities
    let value = target.value
    if (/^\d*$/.test(value)) value = +value

    if (target.checked) {
      newAvailabilities = [...availabilities, value]
    } else {
      newAvailabilities = [
        ...availabilities.slice(0, availabilities.indexOf(value)),
        ...availabilities.slice(availabilities.indexOf(value) + 1)
      ]
    }

    onChange({
      target: {
        name: 'availabilities',
        value: newAvailabilities
      }
    })
  }

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const times = ['morning', 'afternoon', 'evening']
  const checkboxProps = {type: 'checkbox', name: 'availability', onChange: handleChange}
  const rows = times.reduce((rows, time) => {
    rows[time] = days.map(day => {
      const value = `${day}_${time}`
      return <td key={value}><input {...checkboxProps} value={value} checked={availabilities.indexOf(value) > -1} /></td>
    })
    return rows
  }, {})

  return (
    <div>
      <div style={{fontWeight: 'bold'}}>Availability</div>

      <table className='table table-striped table-cond ensed'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Morning</td>
            {rows.morning}
          </tr>
          <tr>
            <td>Afternoon</td>
            {rows.afternoon}
          </tr>
          <tr>
            <td>Evening</td>
            {rows.evening}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
