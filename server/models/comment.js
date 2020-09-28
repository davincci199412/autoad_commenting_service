const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    posted_username: {
      type: String
    },
    comment_id: {
      type: String
    },
    text: {
      type: String
    },
    commented_time: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
