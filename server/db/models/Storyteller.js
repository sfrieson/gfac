import DataType from 'sequelize'
import Model from '../sequelize'

import User from './User'
import { storytellerIdx, formatStorytellerForIndex } from '../elasticlunr'

// http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
const Storyteller = Model.define('storyteller',
  {
    // Should the email be the foreign key?
    userId: {
      type: DataType.UUID,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    instagram: {
      type: DataType.STRING(30),
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    cameraPhone: {
      type: DataType.BOOLEAN,
      defaultValue: false
    },
    cameraDSLR: {
      type: DataType.BOOLEAN,
      defaultValue: false
    },
    cameraFilm: {
      type: DataType.BOOLEAN,
      defaultValue: false
    },
    cameraOther: {
      type: DataType.STRING(30)
    },
    location: {
      type: DataType.STRING(255)
    },
    // TODO add Porfolio elsewhere
    portfolio: {
      type: DataType.STRING
    },
    preferredContactMethod: {
      type: DataType.ENUM('email', 'phone', 'instagram')
    }
  },
  // Options
  // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/model.js#L26
  {
    paranoid: true,
    hooks: {
      afterCreate: function (instance) {
        if (storytellerIdx) {
          const storyteller = instance.get({plain: true})
          storytellerIdx.updateDoc({
            ...storytellerIdx.documentStore.getDoc(storyteller.userId),
            ...formatStorytellerForIndex(storyteller)
          })
        }
      },
      afterupdate: function (instance) {
        if (storytellerIdx) {
          const storyteller = instance.get({plain: true})
          storytellerIdx.updateDoc({
            ...storytellerIdx.documentStore.getDoc(storyteller.userId),
            ...formatStorytellerForIndex(storyteller)
          })
        }
      }
      // Destroy may already be taken care of by User
    }
  }
)

export default Storyteller
