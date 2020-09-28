const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConfigSchema = new Schema(
  {
    price_one_person: {
        type: Number,
        require: true,
        default: 1
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Config', ConfigSchema);