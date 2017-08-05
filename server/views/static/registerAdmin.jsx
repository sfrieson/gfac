import React from 'react'

import InputGroup from '../components/InputGroup'
import RadioGroup from '../components/RadioGroup'

export default {
  title: 'Admin Invite | Gramforacause',
  body: function ({err, responses = {}, admin = {}}) {
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
          <InputGroup name='firstname' label='First name' type='text' value={res.firstname} />
          <InputGroup name='lastname' label='Last name' type='text' value={res.lastname} />
          <InputGroup name='email' label='Email' type='text' value={res.email} />
          <InputGroup name='password' label='Password' type='password' />
          <InputGroup name='confirm' label='Confirm Password' type='password' />
          <InputGroup name='phone' label='Phone number' type='text' />
          <RadioGroup
            name='phoneType'
            label='Phone Type'
            options={[{label: 'Mobile', value: 'mobile'}, {label: 'Office', value: 'office'}]}
            value={res.phoneType}
          />
          <button className='btn'>Submit</button>
        </form>
      </div>
    )
  }
}
