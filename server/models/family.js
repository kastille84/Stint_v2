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
  }

})

module.exports = mongoose.model("Family", schema);