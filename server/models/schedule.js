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
  monday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  tuesday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  wednesday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  thursday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  friday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  saturday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  sunday: {
    type: [{
          chore: String,
          completed: Boolean,
        }],
    default: null
  },
  

})

module.exports = mongoose.model("Schedule", schema);
