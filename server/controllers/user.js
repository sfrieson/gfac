import bcrypt from 'bcryptjs';

import { auth } from '../config';
import { Cause, Contact, Photographer, User as UserModel } from '../db/models';

const SALT = bcrypt.genSaltSync(auth.salt);
const hashPassword = (function (password) { return bcrypt.hashSync(password, SALT); });

const User = {
  checkPassword: function (email, password) {
    return this.get({email})
    .then(user => {
      if (!user) throw new Error ('Incorrect user or password.')
      if (bcrypt.compareSync(password, user.hashPassword)) return user;
      else throw new Error('Incorrect user or password.');
    });
  },
  create: function (data) {
    data.hashPassword = hashPassword(data.password);
    return UserModel.create(data)
    .then((user) => {
      if (user.role === 'photographer') return this.createPhotographer(user);
      else if (user.role === 'nonprofit') return this.createNonprofit(user);
    })
    .catch(() => Promise.reject({
      type: 'Account Creation',
      status: 500,
      message: 'Account registration failed'
    }));
  },
  createNonprofit: function (user) { return user; },
  createPhotographer: function (user ) { return user; },
  get: function (query) { return UserModel.findOne({where: query}); },
  validate: function (data) {
    var errors = [];

    if (!data.password || data.password !== data.confirm) errors.push('Password does not match.');
    if (errors.length  === 0) return Promise.resolve(data);
    else return Promise.reject({
      type: 'Validation Error',
      errors: errors
    });
  }
};

export default User;