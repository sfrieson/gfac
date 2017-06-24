import { Cause } from '../models'
const causes = 'Adults with Special Needs|Education|Seniors|Career Prep|Health & Fitness|Animals &' +
  ' Environment|Hunger|Children with Special Needs|Disaster Response'

export default function () {
  return Cause.bulkCreate(
    causes.split('|').map(name => ({name}))
  )
}
