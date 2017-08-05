import React from 'react'

import InputGroup from '../components/InputGroup'
import RadioGroup from '../components/RadioGroup'
import ContactMore from '../partials/register-contact'
import StorytellerMore from '../partials/register-storyteller'

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
          <InputGroup name='firstname' label='First name' type='text' value={responses.firstname} />
          <InputGroup name='lastname' label='Last name' type='text' value={responses.lastname} />
          <InputGroup name='email' label='Email' type='text' value={responses.email} />
          <InputGroup name='password' label='Password' type='password' />
          <InputGroup name='confirm' label='Confirm Password' type='password' />
          <InputGroup name='phone' label='Phone number' type='text' />

          <RadioGroup
            name='phoneType'
            label='Phone Type'
            options={[{label: 'Mobile', value: 'mobile'}, {label: 'Office', value: 'office'}]}
            value={responses.phoneType}
          />

          <div className='input-group'>
            <label for='role'>Which are you?</label>
            <select name='role' id='role' className='form-control' defaultValue={responses.role || 'default'}>
              <option value='default' disabled>Select one...</option>
              <option value='photographer'>Photographer</option>
              <option value='contact'>Nonprofit Contact</option>
            </select>
          </div>

          <ContactMore responses={responses} />
          <StorytellerMore responses={responses} />

          <button className='btn'>Submit</button>
        </form>
        <script dangerouslySetInnerHTML={{__html: `
          var more = {
            photographer: document.getElementById('photographer-more'),
            contact: document.getElementById('contact-more')
          }
          var role = document.getElementById('role');
          role.addEventListener('change', function (e) {
            var val = e.target.value;

            ['photographer', 'contact'].forEach(function (role) {
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
