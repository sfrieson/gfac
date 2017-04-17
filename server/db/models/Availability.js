/**
 * Created by sfrieson on 3/22/17.
 */
import DataType from 'sequelize';
import Model from '../sequelize';

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Availability = Model.define('availability', {
  day: {
    type: DataType.ENUM('M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'),
    nullAllowed: false,
  },
  time: {
    type: DataType.ENUM('morning', 'afternoon', 'evening'),
    nullAllowed: false,
  },
});

export default Availability;
