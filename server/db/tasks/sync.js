import models from '../models'
module.exports = function sync (force = false) {
  return models.sync({force})
}
