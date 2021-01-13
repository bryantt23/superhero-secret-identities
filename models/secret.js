var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SecretInstanceSchema = new Schema({
  superheroName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  secretIdentity: { type: String, required: true }
});

// Virtual for book's URL
SecretInstanceSchema.virtual('url').get(function () {
  return '/secret/' + this._id;
});

//Export model
module.exports = mongoose.model('Secret', SecretInstanceSchema);
