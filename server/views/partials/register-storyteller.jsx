import React from 'react'

import config from 'config'
import CheckboxGroup from '../components/CheckboxGroup'
const causes = config.get('client.fields.causes')

export default function ({responses}) {
  const hidden = responses.selected !== 'photographer'
  return (
    <fieldset id='photographer-more' className={hidden && 'hidden'} aria-hidden={hidden}>
      {causes.label}
      <div className='checkbox'>{causes.options.map((cause, key) => (
        <CheckboxGroup
          key={key} name={causes.name}
          value={cause.value}
          label={cause.label}
          checked={responses.causes && responses.causes.indexOf(cause.value) > -1}
        />
      ))}</div>

      <label for='instagram'>Instagram Handle</label>
      <div className='input-group'>
        <span className='input-group-addon' id='basic-addon1'>@</span>
        <input name='instagram' type='text' id='instagram' className='form-control' />
      </div>
      How I generally take photos:
      <div className='checkbox'>
        <label>
          <input name='cameraPhone' type='checkbox' />Phone
        </label>
        <label>
          <input name='cameraFilm' type='checkbox' />Film
        </label>
        <label>
          <input name='cameraDSLR' type='checkbox' />DSLR
        </label>
        <div className='input-group'>
          <span className='input-group-addon' id='basic-addon1'>Other</span>
          <input name='cameraOther' type='text' className='form-control' />
        </div>
      </div>
      <div className='input-group'>
        <label for='preferredContactMethod'>Preferred Contact Method</label>
        <select name='preferredContactMethod' id='preferredContactMethod' className='form-control' >
          <option value='instagram'>Instagram Direct Message</option>
          <option value='phone'>Phone</option>
          <option value='email'>Email</option>
        </select>
      </div>

      <AvailabilityTable />
    </fieldset>
  )
}

function AvailabilityTable () {
  return (
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
          <td><input type='checkbox' name='availability' value='Mo_morning' /></td>
          <td><input type='checkbox' name='availability' value='Tu_morning' /></td>
          <td><input type='checkbox' name='availability' value='We_morning' /></td>
          <td><input type='checkbox' name='availability' value='Th_morning' /></td>
          <td><input type='checkbox' name='availability' value='Fr_morning' /></td>
          <td><input type='checkbox' name='availability' value='Sa_morning' /></td>
          <td><input type='checkbox' name='availability' value='Su_morning' /></td>
        </tr>
        <tr>
          <td>Afternoon</td>
          <td><input type='checkbox' name='availability' value='Mo_afternoon' /></td>
          <td><input type='checkbox' name='availability' value='Tu_afternoon' /></td>
          <td><input type='checkbox' name='availability' value='We_afternoon' /></td>
          <td><input type='checkbox' name='availability' value='Th_afternoon' /></td>
          <td><input type='checkbox' name='availability' value='Fr_afternoon' /></td>
          <td><input type='checkbox' name='availability' value='Sa_afternoon' /></td>
          <td><input type='checkbox' name='availability' value='Su_afternoon' /></td>
        </tr>
        <tr>
          <td>Evening</td>
          <td><input type='checkbox' name='availability' value='Mo_evening' /></td>
          <td><input type='checkbox' name='availability' value='Tu_evening' /></td>
          <td><input type='checkbox' name='availability' value='We_evening' /></td>
          <td><input type='checkbox' name='availability' value='Th_evening' /></td>
          <td><input type='checkbox' name='availability' value='Fr_evening' /></td>
          <td><input type='checkbox' name='availability' value='Sa_evening' /></td>
          <td><input type='checkbox' name='availability' value='Su_evening' /></td>
        </tr>
      </tbody>
    </table>
  )
}
