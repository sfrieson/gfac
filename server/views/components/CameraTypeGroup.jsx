import React from 'react'
export default function ({label}) {
  return (
    <div>
      {label}
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
    </div>
  )
}
