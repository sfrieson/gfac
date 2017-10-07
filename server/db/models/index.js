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
// import Attachment from './Attachment';
import Availability from './Availability'
import Cause from './Cause'
import Contact from './Contact'
import Event from './Event'
import Nonprofit from './Nonprofit'
import Storyteller from './Storyteller'
import Project from './Project'
import Review from './Review'
// import Task from './Task';
import User from './User'
import UserLogin from './UserLogin'

Availability.belongsTo(Storyteller)

Cause.belongsToMany(Nonprofit, {through: 'focuses'})
Cause.belongsToMany(Project, {through: 'project_focuses'})
Cause.belongsToMany(Storyteller, {through: 'interests'})

Contact.belongsTo(Nonprofit)
Contact.belongsTo(User, {onDelete: 'cascade'})
// Contact.belongsToMany(Project, {through: Nonprofit}) // Not necessary?

Event.belongsTo(User)
Event.belongsTo(Project)

Nonprofit.hasMany(Contact)
Nonprofit.hasMany(Project)
Nonprofit.belongsToMany(Cause, {through: 'focuses'})

// Storyteller.hasMany(Assignment);
Storyteller.belongsToMany(Cause, {through: 'interests'})
Storyteller.belongsToMany(Project, {through: 'assignments'})
Storyteller.hasMany(Availability)
Storyteller.belongsTo(User, {onDelete: 'cascade'})

Project.belongsTo(Nonprofit)
// Project.belongsToMany(Contact, { through: Nonprofit }); // Not necessary?
// Project.hasMany(Assignment);
// Project.hasMany(Attachment);
Project.belongsToMany(Storyteller, {through: 'assignments'})
Project.belongsToMany(Cause, {through: 'project_focuses'})
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
  Storyteller, Project, Review, User, UserLogin }
