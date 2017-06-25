/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize'
// import Admin from './Admin';
// import Assignment from './Assignment';
import Availability from './Availability'
import Cause from './Cause'
import Contact from './Contact'
import Event from './Event'
import Nonprofit from './Nonprofit'
import Photographer from './Photographer'
import Project from './Project'
import Review from './Review'
// import Task from './Task';
import User from './User'
import UserLogin from './UserLogin'

Availability.belongsTo(Photographer)
Cause.belongsToMany(Photographer, {through: 'interests'})
Cause.belongsToMany(Nonprofit, {through: 'focuses'})
Contact.belongsTo(Nonprofit)
Contact.belongsTo(User)
// Contact.belongsToMany(Project, {through: Nonprofit}) // Not necessary?
Event.belongsTo(User)
Event.belongsTo(Project)
Nonprofit.hasMany(Contact)
Nonprofit.hasMany(Project)
Nonprofit.belongsToMany(Cause, {through: 'focuses'})
// Photographer.hasMany(Assignment);
Photographer.belongsToMany(Cause, {through: 'interests'})
Photographer.belongsToMany(Project, {through: 'assignments'})
Photographer.hasMany(Availability)
Photographer.belongsTo(User)
Project.belongsTo(Nonprofit)
// Project.belongsToMany(Contact, { through: Nonprofit }); // Not necessary?
// Project.hasMany(Assignment);
Project.belongsToMany(Photographer, {through: 'assignments'})
Project.hasMany(Event)
Project.hasMany(Review)

User.hasMany(Event)
User.belongsTo(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade'
})

function sync (...args) {
  return sequelize.sync(...args)
}

export default { sync }
export { Availability, Cause, Contact, Event, Nonprofit,
  Photographer, Project, Review, User, UserLogin }
