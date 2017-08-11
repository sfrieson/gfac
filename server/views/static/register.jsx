import React from 'react'
import config from 'config'

import AvailabilityGroup from '../components/AvailabilityGroup'
import CameraTypeGroup from '../components/CameraTypeGroup'
import InputGroup from '../components/InputGroup'
import RadioGroup from '../components/RadioGroup'

const fields = config.get('client.fields')
const userFields = config.get('client.fieldsets.registerUser').map(fieldName => fields[fieldName])
const contactFields = config.get('client.fieldsets.registerContact').map(fieldName => fields[fieldName])
const storytellerFields = config.get('client.fieldsets.registerStoryteller').map(fieldName => fields[fieldName])

function renderField (props, key) {
  switch (props.inputType) {
    case 'RadioGroup': return <RadioGroup key={key} {...props} />
    case 'CameraTypeGroup': return <CameraTypeGroup key={key} {...props} />
    case 'AvailabilityGroup': return <AvailabilityGroup key={key} {...props} />
    default: return <InputGroup key={key} {...props} />
  }
}
export default {
  title: 'Create an Account | Gramforacause',
  head: `
    <style>
    .hidden {
      display: none;
    }
    </style>
  `,
  body: function ({err, responses}) {
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

        <h1>Create an account</h1>
        <form method='POST' action='/register'>
          {userFields.map(renderField)}

          <div className='input-group'>
            <label for='role'>Which are you?</label>
            <select name='role' id='role' className='form-control' defaultValue={responses.role || 'default'}>
              <option value='default' disabled>Select one...</option>
              <option value='storyteller'>Storyteller</option>
              <option value='contact'>Nonprofit Contact</option>
            </select>
          </div>

          <fieldset id='contact-more' className={responses.selected !== 'contact' && 'hidden'} aria-hidden={responses.selected !== 'contact'}>
            <span className='help-block'>
              Note: If your nonprofit already has an account, ask your coworker for an invite link.
            </span>
            {contactFields.map(renderField)}
          </fieldset>

          <fieldset id='storyteller-more' className={responses.selected !== 'storyteller' && 'hidden'} aria-hidden={responses.selected !== 'storyteller'}>
            {storytellerFields.map(renderField)}
          </fieldset>

          <button className='btn'>Submit</button>
        </form>
        <script dangerouslySetInnerHTML={{__html: `
          var more = {
            storyteller: document.getElementById('storyteller-more'),
            contact: document.getElementById('contact-more')
          }
          var role = document.getElementById('role');
          role.addEventListener('change', function (e) {
            var val = e.target.value;

            ['storyteller', 'contact'].forEach(function (role) {
              var el = more[role];
              var hidden = /hidden/.test(el.className);
              if (val === role) {
                if (hidden) {
                  el.setAttribute('aria-hidden', 'false')
                  el.className = el.className.replace('hidden', '')
                }
              } else {
                if (!hidden) {
                  el.setAttribute('aria-hidden', 'true')
                  el.className += 'hidden';
                }
              }
            });
          });
        `}} />
      </div>
    )
  }
}
