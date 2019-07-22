const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  family_email: {
    type: String,
    unique: true,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  },
  family_password: {
    type: String,
    required: true
  },
  family_nickname: {
    type: String,
    required: true
  },
  parents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent'
    }
  ],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child'
    }
  ]

})

module.exports = mongoose.model("Family", schema);