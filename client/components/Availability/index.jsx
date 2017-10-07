import React from 'react'
export default function ({values}) {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const times = ['morning', 'afternoon', 'evening']
  const rows = times.reduce((rows, time) => {
    rows[time] = days.map(day => {
      const v = `${day}_${time}`
      return <td key={v} style={{backgroundColor: values.indexOf(v) > -1 && 'lightgreen'}} />
    })

    return rows
  }, {})

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
  )
}
