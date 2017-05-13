/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize'
import Model from '../sequelize'

const UserLogin = Model.define('user_login', {
  email: {
    type: DataType.STRING(64),
    primaryKey: true
  },
  userId: {
    type: DataType.UUID
  },
  hashPassword: {
    type: DataType.STRING(100)
  },
  loginAttempts: {
    type: DataType.INTEGER
  },
  lockoutUntil: {
    type: DataType.INTEGER
  }
}, {
  indexes: [{ fields: ['email'] }],
  hooks: {}
})

export default UserLogin
