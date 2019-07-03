const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  pin: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  family_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  parents_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  }]

})

module.exports = mongoose.model("Child", schema);