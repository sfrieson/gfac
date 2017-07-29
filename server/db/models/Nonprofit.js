import DataType from 'sequelize'
import Model from '../sequelize'

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Nonprofit = Model.define('nonprofit',
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
    city: {
      type: DataType.STRING(30)
    },
    state: {
      type: DataType.STRING(30)
    },
    country: {
      type: DataType.STRING(30)
    },
    website: {
      type: DataType.STRING(64)
    }
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    indexes: [{ fields: ['id'] }],
    paranoid: true
  }
)

export default Nonprofit
