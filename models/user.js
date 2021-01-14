var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserInstanceSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    unique: true
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isMember: { type: Boolean, default: false },
  secrets: [
    {
      superheroName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
      },
      secretIdentity: { type: String, required: true }
    }
  ]
});

// Virtual for book's URL
UserInstanceSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserInstanceSchema);
