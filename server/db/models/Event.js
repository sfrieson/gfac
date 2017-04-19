import DataType from 'sequelize';
import Model from '../sequelize';

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const EventType = Model.define('event_type',
  {
    id: {
      type: DataType.INTEGER,
      primaryKey: true
    }
  }
);

const Event = Model.define('event',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true
    },
    type: {
      type: DataType.INTEGER,
      references: {
        model: EventType,
        key: 'id'
      }
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
);


export default Event;

