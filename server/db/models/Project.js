import DataType from 'sequelize'
import Model from '../sequelize'

// http://docs.sequelizejs.com/en/latRatingest/docs/models-definition/#data-types
const Project = Model.define('project',
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    attendance: {
      type: DataType.INTEGER
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
    description: {
      type: DataType.TEXT
    },
    duration: {
      type: DataType.INTEGER
    },
    // in the future this may be the google place_id
    location: {
      type: DataType.STRING(255)
    },
    locationType: {
      type: DataType.STRING
    },
    name: {
      type: DataType.STRING
    },
    photoLink: {
      type: DataType.STRING(255)
    },
    photographersNeeded: {
      type: DataType.INTEGER
    },
    status: {
      type: DataType.ENUM('prospective', 'planning', 'past', 'completed')
    },
    venue: {
      type: DataType.STRING(140)
    },
    website: {
      type: DataType.STRING(255)
    }
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    indexes: [{ fields: ['id'] }],
    paranoid: true
  }
)

export default Project
