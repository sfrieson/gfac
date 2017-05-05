import DataType from 'sequelize'
import Model from '../sequelize'

// http://docs.sequelizejs.com/en/latRatingest/docs/models-definition/#data-types
const Project = Model.define('project',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true
    },
    name: {
      type: DataType.STRING
    },
    description: {
      type: DataType.TEXT
    },
    date: {
      type: DataType.DATE,
      allowNull: false
    },
    dateIsApprox: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    location: {
      type: DataType.STRING(255)
    },
    status: {
      type: DataType.ENUM('Prospective', 'Planning', 'Past', 'Completed')
    },
    photoLink: {
      type: DataType.STRING(255)
    }
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    indexes: [{ fields: ['id'] }],
    paranoid: true
    // TODO instanceMethods
    // TODO classMethods
    // TODO hooks
  }
)

export default Project
