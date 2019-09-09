const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  family_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reward_name: {
    type:String,
    default: ''
  },
  reward_goal: {
    type: Number,
    default: 10
  },
  reward_currently: {
    type: Number,
    default: 0
  },
  reward_status: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Reward', schema);