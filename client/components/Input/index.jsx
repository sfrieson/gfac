import React from 'react'
import PropTypes from 'prop-types'
import { fields } from 'client-config'
import moment from 'moment'
import {
  Checkbox as AntCheckbox,
  DatePicker,
  Input as AntInput,
  Radio as AntRadio,
  Select as AntSelect
} from 'antd'

export default function Input (props) {
  const {
    onChange,
    name,
    type = 'text',
    value
  } = props

  if (type === 'date') return <DateInput {...props} />
  if (type === 'radio') return <RadioGroup {...props} />
  if (type === 'hidden') return <AntInput {...props} />
  if (type === 'causes') return <Checkboxes {...props} options={fields.causes.options} />
  if (type === 'select') return <Select {...props} />
  if (type === 'textarea') return <AntInput.TextArea {...props} />
  if (type === 'checkbox') return <Checkbox {...props} />
  if (type === 'checkboxes') return <Checkboxes {...props} />
  if (type === 'availability') return <Availability {...props} />

  return <AntInput name={name} id={name} value={value} onChange={onChange} />
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

const dateFormat = 'MM/DD/YYYY'
function DateInput ({ label, name, value, ...props }) {
  return (
    <DatePicker
      id={`${name}-input`}
      name={name}
      min={getDate()}
      value={value ? moment(value) : getDate()}
      format={dateFormat}
    />
  )

  function getDate () {
    return moment(Date.now())
  }
}
// -----------
// Radio Input
// -----------

function RadioGroup (props) {
  const {
    options,
    onChange,
    name,
    value
  } = props

  return (
    <AntRadio.Group id={`radio-group-${name}`} name={name} onChange={onChange} value={value}>
      {options.map(({ value, label }) => <AntRadio key={value} value={value}>{label}</AntRadio>)}
    </AntRadio.Group>
  )
}

// ------------
// Select Input
// ------------

function Select (props) {
  const {
    options,
    onChange,
    name,
    value
  } = props

  return (
    <AntSelect
      id={name}
      name={name}
      onChange={handleSelectChange}
      placeholder='Please select one...'
      value={value}
    >
      {options.map(({ label, value }) => <AntSelect.Option key={label} value={value}>{label}</AntSelect.Option>)}
    </AntSelect>
  )

  function handleSelectChange (value) {
    return onChange({target: {name, value}})
  }
}

// --------------
// Checkbox Input
// --------------

// <Input type='checkbox' label='Film' name="cameraFilm" checked={false} onChange={updateFn} />

function Checkbox ({ checked, label, onChange, value, ...props }) {
  let checkedValue = checked // Coming from Checkboxes
  if (checkedValue === undefined) checkedValue = value // Made directly with Checkbox
  return <AntCheckbox {...props} onChange={normalizeChange} checked={!!checkedValue}>{label}</AntCheckbox>

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
*   />
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
    <div>
      <div style={{fontWeight: 'bold'}}>{label}</div>
      {renderChecks(options)}
    </div>
  )

  function renderChecks (checks) {
    return checks.map(({label, name, value}) => {
      return (
        <Checkbox
          key={`${name}_${value}`}
          checked={values.indexOf(name || value) > -1}
          label={label}
          name={name || sameName}
          value={value}
          onChange={handleChange}
        />
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

      <table className='table table-striped table-condensed'>
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
