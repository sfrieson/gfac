import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import { auth } from '../config';
import { Cause, Contact, Photographer as PhotoModel, User as UserModel } from '../db/models';

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
    // Whitelist properties necessary for creating User
    const d = pick(data, ['firstname', 'lastname', 'email', 'role', 'phone', 'phoneType']);
    d.hashPassword = hashPassword(data.password);

    return UserModel.create(d)
    .then((user) => {
      if (user.role === 'photographer') return this.createPhotographer(user, data);
      if (user.role === 'nonprofit') return this.createNonprofit(user, data);
    })
    .catch(() => Promise.reject({
      type: 'Account Creation',
      status: 500,
      message: 'Account registration failed'
    }));
  },
  createNonprofit: function (user, data) { return user; },
  createPhotographer: function (user, data) {
    // Whitelist properties necessary for creating Photographer
    const d = pick(Object.assign(data, user), ['instagram', 'cameraPhone', 'cameraDSLR', 'cameraFilm',
      'cameraOther', 'preferredContactMethod']);
    d.userId = user.id;
    ['cameraPhone', 'cameraDSLR', 'cameraFilm'].forEach(prop => {
      if (prop in d) d[prop] = true;
    });

    return PhotoModel.create(d)
    .then(photographer => {
      return photographer.setCauses(data.causes)
      .then(res => Object.assign(user.get(), photographer.get()))
    });
  },
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