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
      type: DataType.STRING(15)
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
    // Google's place_id will maybe take the place of location
    // googlePlaceId: {
    //   type: DataType.STRING(255)
    // },
    location: {
      type: DataType.STRING(255)
    },
    name: {
      type: DataType.STRING
    },
    photoLink: {
      type: DataType.STRING(255)
    },
    storytellersNeeded: {
      type: DataType.INTEGER
    },
    status: {
      type: DataType.ENUM('prospective', 'planning', 'past', 'completed')
    },
    venueName: {
      type: DataType.STRING(140)
    },
    venueType: {
      type: DataType.STRING(12) // indoor, outoor, both
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
