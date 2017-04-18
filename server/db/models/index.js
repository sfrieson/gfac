/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
// import Admin from './Admin';
// import Assignment from './Assignment';
import Availability from './Availability';
import Cause from './Cause';
import Contact from './Contact';
import Event from './Event';
import Nonprofit from './Nonprofit';
import Photographer from './Photographer';
import Project from './Project';
import Review from './Review';
// import Task from './Task';
import User from './User';
import UserLogin from './UserLogin';
import UserProfile from './UserProfile';


Availability.belongsTo(Photographer);
Cause.belongsToMany(Photographer, { through: 'Interests' });
Cause.belongsToMany(Nonprofit, { through: 'Focus' });
Contact.belongsTo(Nonprofit);
// Contact.hasMany(Project, { through: Nonprofit });
Event.belongsTo(User);
Event.belongsTo(Project);
Nonprofit.hasMany(Contact);
Nonprofit.hasMany(Project);
Nonprofit.belongsToMany(Cause, { through: 'Focus' });
// Photographer.hasMany(Assignment);
Photographer.belongsToMany(Project, { through: 'Assignment' });
Photographer.hasMany(Availability);
Project.belongsTo(Nonprofit);
// Project.belongsToMany(Contact, { through: Nonprofit });
// Project.hasMany(Assignment);
Project.belongsToMany(Photographer, { through: 'Assignment' });
Project.hasMany(Event);
Project.hasMany(Review);

User.hasMany(Event);
User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Availability, Cause, Contact, Event, Nonprofit,
  Photographer, Project, Review, User, UserLogin, UserProfile };
