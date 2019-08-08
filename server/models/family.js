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
  ],
  chorelist: [String]

})

// schema.post('save', function(error, doc, next) {
//   if(error.name === "MongoError" && error.code === 11000) {
//     next(new Error('This is a duplicate record. Try another'))
//   } else {
//     next(error);
//   }
// });
module.exports = mongoose.model("Family", schema);