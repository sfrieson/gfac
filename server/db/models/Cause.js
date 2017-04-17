import DataType from 'sequelize';
import Model from '../sequelize';

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Cause = Model.define('availability', {
  id: {
    type: DataType.INTEGER,
    primaryKey: true
  },
  cause: {
    type: DataType.STRING(64),
  }
});

export default Cause;
