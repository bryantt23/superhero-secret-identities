var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserInstanceSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
    unique: true
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isMember: { type: Boolean, default: false }
});

// Virtual for book's URL
UserInstanceSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserInstanceSchema);
