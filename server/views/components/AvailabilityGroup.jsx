import React from 'react'
export default function AvailabilityTable ({label, name}) {
  return (
    <div>
      {label}
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
            <td><input type='checkbox' name={name} value='Mo_morning' /></td>
            <td><input type='checkbox' name={name} value='Tu_morning' /></td>
            <td><input type='checkbox' name={name} value='We_morning' /></td>
            <td><input type='checkbox' name={name} value='Th_morning' /></td>
            <td><input type='checkbox' name={name} value='Fr_morning' /></td>
            <td><input type='checkbox' name={name} value='Sa_morning' /></td>
            <td><input type='checkbox' name={name} value='Su_morning' /></td>
          </tr>
          <tr>
            <td>Afternoon</td>
            <td><input type='checkbox' name={name} value='Mo_afternoon' /></td>
            <td><input type='checkbox' name={name} value='Tu_afternoon' /></td>
            <td><input type='checkbox' name={name} value='We_afternoon' /></td>
            <td><input type='checkbox' name={name} value='Th_afternoon' /></td>
            <td><input type='checkbox' name={name} value='Fr_afternoon' /></td>
            <td><input type='checkbox' name={name} value='Sa_afternoon' /></td>
            <td><input type='checkbox' name={name} value='Su_afternoon' /></td>
          </tr>
          <tr>
            <td>Evening</td>
            <td><input type='checkbox' name={name} value='Mo_evening' /></td>
            <td><input type='checkbox' name={name} value='Tu_evening' /></td>
            <td><input type='checkbox' name={name} value='We_evening' /></td>
            <td><input type='checkbox' name={name} value='Th_evening' /></td>
            <td><input type='checkbox' name={name} value='Fr_evening' /></td>
            <td><input type='checkbox' name={name} value='Sa_evening' /></td>
            <td><input type='checkbox' name={name} value='Su_evening' /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
