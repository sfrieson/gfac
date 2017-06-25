import { Cause } from '../models'
const list = [
  'Adults with Special Needs',
  'Education',
  'Seniors',
  'Career Prep',
  'Health & Fitness',
  'Animals & Environment',
  'Hunger',
  'Children with Special Needs',
  'Disaster Response'
]

export default function () {
  return Cause.bulkCreate(
    list.map(name => ({name}))
  )
}
export { list }
