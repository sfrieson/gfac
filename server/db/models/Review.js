import DataType from 'sequelize'
import Model from '../sequelize'
import User from './User'

const Review = Model.define('review',
  {
    id: {
      type: DataType.UUID,
      primaryKey: true
    },
    rating: {
      type: DataType.INTEGER,
      allowNull: false
    },
    review: {
      type: DataType.TEXT
    },
    userID: {
      type: DataType.UUID,
      references: {
        model: User,
        key: 'id'
      }
    }
  }
)

export default Review
