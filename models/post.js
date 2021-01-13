var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostInstanceSchema = new Schema({
  secret: {
    type: Schema.Types.ObjectId,
    ref: 'Secret',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Virtual for book's URL
PostInstanceSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

//Export model
module.exports = mongoose.model('Post', PostInstanceSchema);
