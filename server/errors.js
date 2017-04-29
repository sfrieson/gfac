export function ValidationError (message, errors) {
  this.name = 'Validation Error'
  this.message = message || 'No specifics supplied'
  this.stack = (new Error()).stack
  this.errors = errors
}

ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.constructor = ValidationError
