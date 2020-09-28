const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    posted_user: {
        type: Schema.Types.ObjectId,
        ref: 'PopularUser',
        required: true
    },
    id: {
      type: String,
      required: true,
    },
    shortcode: {
      type: String,
      required: true,
    },
    caption: {
      type: String
    },
    posted_time: {
        type: Date
    },
    like_count: {
        type: Number
    },
    comment_count: {
        type: Number
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);
