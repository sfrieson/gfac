import React from 'react'
import config from 'config'

import InputGroup from '../components/InputGroup'
import RadioGroup from '../components/RadioGroup'

const fields = config.get('client.fields')
const adminFields = config.get('client.fieldsets.registerAdmin').map(fieldName => fields[fieldName])

export default {
  title: 'Admin Invite | Gramforacause',
  body: function ({err = [], responses = {}, admin = {}}) {
    const res = Object.assign(admin, responses)

    return (
      <div>
        {err.length
          ? <div> Errors:
            <ul>{err.forEach(error => (
              <li>{error}</li>
            ))}</ul>
          </div>
          : ''
        }

        <h1>Create an Admin Account</h1>
        <form method='POST' action='/register'>
          {adminFields.map(renderField)}
          <button className='btn'>Submit</button>
        </form>
      </div>
    )

    function renderField (props, key) {
      switch (props.type) {
        case 'radio': return <RadioGroup key={key} {...props} value={res[props.name]} />
        default: return <InputGroup key={key} {...props} value={res[props.name]} />
      }
    }
  }
}
