import DataType from 'sequelize'
import Model from '../sequelize'

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types

const User = Model.define('user',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true
    },
    email: {
      type: DataType.STRING(64),
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    emailConfirmed: {
      type: DataType.BOOLEAN,
      defaultValue: false
    },
    firstname: {
      type: DataType.STRING(32),
      allowNull: false
      // TODO validate?
    },
    lastname: {
      type: DataType.STRING(32),
      allowNull: false
      // TODO validate?
    },
    role: {
      type: DataType.ENUM('admin', 'photographer', 'contact')
      // TODO Reference a roles table?
    },
    phone: {
      type: DataType.STRING(24)
    },
    phoneType: {
      type: DataType.ENUM('mobile', 'office', 'home')
    },
    newsletter: {
      type: DataType.BOOLEAN,
      default: false
    },

    hashPassword: {
      type: DataType.STRING(100)
    },
    loginAttempts: {
      type: DataType.INTEGER
    },
    lockoutUntil: {
      type: DataType.INTEGER
    },
    loginToken: {
      type: DataType.STRING
    },
    tokenExpires: {
      type: DataType.INTEGER
    }
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    indexes: [{ fields: ['email', 'id'] }],
    paranoid: true
  }
)

export default User
