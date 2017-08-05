import React from 'react'

import InputGroup from '../components/InputGroup'
import RadioGroup from '../components/RadioGroup'
export default function ContactMore ({responses}) {
  const hidden = responses.selected !== 'contact'
  return (
    <fieldset id='contact-more' className={hidden && 'hidden'} aria-hidden={hidden}>
      <span className='help-block'>
        Note: If your nonprofit already has an account, ask your coworker for an invite link.
      </span>
      <InputGroup name='phoneSecondary' type='tel' label='Secondary Phone number' value={responses.phoneSecondary} />

      <RadioGroup
        name='phoneSecondaryType'
        label='Secondary Phone Type'
        options={[{label: 'Mobile', value: 'mobile'}, {label: 'Office', value: 'office'}]}
        value={responses.phoneType}
      />

      <h3>Nonprofit Information</h3>
      <div>
        <InputGroup name='nonprofit_name' label='Nonprofit Name' type='text' value={responses.nonprofit_name} />
        <div className='form-group'>
          <label for='nonprofit_description'>Short Description</label>
          <textarea name='nonprofit_description' className='form-control' rows='3' />
        </div>
      </div>
    </fieldset>
  )
}
