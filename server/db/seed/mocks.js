import casual from 'casual'

import { UserController } from '../controllers'

import { list as causeList } from './causes'
const causes = causeList.map((name, id) => ({id: id + 1, name}))

const availabilities = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].reduce((a, day) => {
  ['morning', 'afternoon', 'evening'].forEach(time => a.push({day, time}))
  return a
}, [])

casual.define('causes', () => selectFrom(casual.integer(1, 5), causes.map(({id}) => id)))
casual.define('availabilities', () => selectFrom(casual.integer(2, 7), availabilities))
casual.define('phone_type', () => casual.random_element(['mobile', 'office']))

casual.define('user', () => {
  const password = casual.password
  return {
    email: casual.email,
    emailConfirmed: false,
    firstname: casual.first_name,
    lastname: casual.last_name,
    // role: // found in each specific userType model
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
    role: 'photographer', // from user model
    instagram: casual.username,
    cameraPhone: casual.random_element([true, true, false]),
    cameraDSLR: casual.coin_flip,
    cameraFilm: casual.random_element([true, false, false, false, false]),
    cameraOther: casual.random_element(['medium format', undefined, undefined, undefined, undefined, undefined, undefined, undefined]),
    portfolio: casual.populate_one_of(['', '{{url}}']),
    preferredContactMethod: casual.random_element(['email', 'phone', 'instagram']),
    causes: casual.causes,
    availabilities: casual.availabilities
  }
})

casual.define('contact', () => {
  const user = casual.user
  return {
    ...user,
    role: 'contact', // from user model
    phoneSecondary: casual.phone,
    phoneSecondaryType: casual.phone_type
  }
})
casual.define('project', () => ({
  name: casual.populate('{{full_name}} Day ') + casual.numerify('20##'),
  description: casual.catch_phrase,
  date: casual.date(),
  dateIsApprox: casual.coin_flip,
  location: casual.city
}))

casual.define('projects', () => {
  const chance = Math.random()
  const p = []
  if (chance > 0.7) p.push(casual.project)
  if (chance > 0.3) p.push(casual.project)
  return p
})

casual.define('nonprofit', () => ({
  name: casual.company_name,
  description: casual.populate_one_of(['{{catch_phrase}}', '{{sentences}}']),
  causes: casual.causes,
  projects: casual.projects
}))

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

function selectFrom (num, set) {
  let remaining = [...set]
  let selection = []
  let i = 0
  while (i++ < num) {
    const nextIndex = Math.floor(Math.random() * remaining.length)
    selection.push(remaining[nextIndex])
    remaining = [...remaining.slice(0, nextIndex), ...remaining.slice(nextIndex + 1)]
  }

  return selection
}
