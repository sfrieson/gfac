import casual from 'casual'

import { UserController } from '../controllers'

casual.define(
  'phone_type',
  () => casual.random_element(['mobile', 'office', 'home'])
)

casual.define('user', () => {
  const password = casual.password
  return {
    email: casual.email,
    emailConfirmed: false,
    firstname: casual.first_name,
    lastname: casual.last_name,
    role: casual.random_element(['admin', 'photographer', 'contact']),
    phone: casual.phone,
    phoneType: casual.phone_type,
    newsletter: casual.random_element([true, true, true, false]),
    password: password,
    hashPassword: UserController.hashPassword(password)
  }
})

casual.define('photographer', () => {
  const user = casual.user
  return {
    ...user,
    instagram: casual.username,
    cameraPhone: casual.random_element([true, true, false]),
    cameraDSLR: casual.coin_flip,
    cameraFilm: casual.random_element([true, false, false, false, false]),
    cameraOther: casual.random_element(['medium format', undefined, undefined, undefined, undefined, undefined, undefined, undefined]),
    portfolio: casual.populate_one_of(['', 'www.{{url}}', '{{url}}']),
    preferredContactMethod: casual.random_element(['email', 'phone', 'instagram'])
  }
})

casual.define('contact', () => {
  const user = casual.user
  return {
    ...user,
    phoneSecondary: casual.phone,
    phoneSecondaryType: casual.phone_type
  }
})

casual.define('nonprofit', () => ({
  name: casual.company_name,
  description: casual.populate_one_of(['{{catch_phrase}}', '{{sentences}}'])
}))
casual.define('cause', () => {})
casual.define('project', () => {})
casual.define('availability', () => {})

export function Photographer (num = 1) {
  const photographers = []
  let i = 0
  while (i++ < num) photographers.push(casual.photographer)

  return photographers
}

export function Contact (num = 1) {
  let i = 0
  const nonprofits = []
  while (i++ < Math.ceil(num / 1.25)) nonprofits.push(casual.nonprofit)

  i = 0
  let contacts = []
  while (i++ < num) contacts.push(casual.contact)

  return {contacts, nonprofits}
}
