import React from 'react'
import { renderToString } from 'react-dom/server'

import structure from './_base'

import login from './login'
import changePassword from './changePassword'
import emailSuccess from './emailSuccess'
import forgotPassword from './forgotPassword'
import registerAdmin from './registerAdmin'
import register from './register'

const templates = {
  login,
  changePassword,
  emailSuccess,
  forgotPassword,
  registerAdmin,
  register
}

export default function (t, props) {
  checkProps(t, props)
  const {title, head, body: Body} = templates[t]
  return structure({
    title,
    head,
    body: renderToString(<Body {...(props || {})} />)
  })
}

function checkProps (name, props) {
  if (typeof name !== 'string') throw new Error('Template name must be a string')
  if (!(name in templates)) throw new Error(`Template does not exist. Name: ${name}`)
  if (props !== undefined && typeof props !== 'object') throw new Error('Props must be an object.')
}
