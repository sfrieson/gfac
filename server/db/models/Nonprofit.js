import DataType from 'sequelize';
import Model from '../sequelize';

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Nonprofit = Model.define('nonprofit',
  {
    id: {
      type: DataType.UUID,
      primaryKey: true,
    },
    name: {
      type: DataType.INTEGER,
    },
    description: {
      type: DataType.TEXT,
    },
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    indexes: [{ fields: ['id'] }],
    paranoid: true,
    // TODO instanceMethods
    // TODO classMethods
    // TODO hooks
  },
);


export default Nonprofit;
