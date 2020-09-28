const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PopularUserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        userId: {
            type: String,
            unique: true,
            required: true
        },
        full_name: {
            type: String
        },
        added_users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('PopularUser', PopularUserSchema);
