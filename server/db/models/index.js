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
Cause.belongsToMany(Photographer, {through: 'interest'});
Cause.belongsToMany(Nonprofit, {through: 'focus'});
Contact.belongsTo(Nonprofit);
// Contact.hasMany(Project, {through: Nonprofit}); // Not necessary?
Event.belongsTo(User);
Event.belongsTo(Project);
Nonprofit.hasMany(Contact);
Nonprofit.hasMany(Project);
Nonprofit.belongsToMany(Cause, {through: 'focus'});
// Photographer.hasMany(Assignment);
Photographer.belongsToMany(Cause, {through: 'interest'});
Photographer.belongsToMany(Project, {through: 'assignment'});
Photographer.hasMany(Availability);
Project.belongsTo(Nonprofit);
// Project.belongsToMany(Contact, { through: Nonprofit }); // Not necessary?
// Project.hasMany(Assignment);
Project.belongsToMany(Photographer, {through: 'assignment'});
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
  return sequelize.sync(...args)
  .then(() => {
    const causes = 'Adults with Special Needs|Education|Seniors|Career Prep|Health & Fitness|Animals &' +
      ' Environment|Hunger|Children with Special Needs|Disaster Response';

    const causeList = causes.split('|').map(name => ({name}));

    if (args[0].force) return Cause.bulkCreate(causeList);
    else return Promise.resolve();
  });
}

export default { sync };
export { Availability, Cause, Contact, Event, Nonprofit,
  Photographer, Project, Review, User, UserLogin, UserProfile };
