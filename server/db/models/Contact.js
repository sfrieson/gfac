import DataType from 'sequelize'
import Model from '../sequelize'
import User from './User'

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Contact = Model.define('contact',
  {
    phoneSecondary: {
      type: DataType.INTEGER
    },
    phoneSecondaryType: {
      type: DataType.ENUM('mobile', 'office', 'home')
    },
    userId: {
      type: DataType.UUID,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    paranoid: true
    // TODO instanceMethods
    // TODO classMethods
    // TODO hooks
  }
)

export default Contact
