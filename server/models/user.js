const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      unique: true,
      required: true
    },
    role: {
      type: Number,
      required: true
    },
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    birthday: {
      type: String
    },
    phone_number: {
      type: String
    },
    profile_limit: {
      type: Number,
      default: 0
    },
    payment_amount: {
      type: Number,
      default: 0
    },
    auto_comment_text: {
      type: [String],
    },
    add_users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PopularUser',
      }
    ]
  },
  {
    timestamps: true,
  },
);

// Pre-save of user to database, hash password if password is modified or new
// UserSchema.pre('save', function(next) {
//   const user = this;
//   const SALT_FACTOR = 10;
//   if (!user.isModified('password')) return next();

//   bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });

// Method to compare password for login
UserSchema.methods.comparePassword = function(loginPassword, cb) {
  bcrypt.compare(loginPassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
