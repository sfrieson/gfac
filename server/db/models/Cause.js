import DataType from 'sequelize'
import Model from '../sequelize'

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Cause = Model.define('cause', {
  // id: {
  //   type: DataType.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true
  // },
  name: {
    type: DataType.STRING(64)
  }
})

export default Cause
