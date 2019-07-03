const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  },
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
  children_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  }]

})

module.exports = mongoose.model("Parent", schema);