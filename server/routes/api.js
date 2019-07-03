const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const { dbUser, dbPass, tks } = require('../config/config');
//models
const Family = require('../models/family');
const Parent = require('../models/parent');
const Child = require('../models/child');

mongoose.connect("mongodb://"+dbUser+":"+dbPass+"@ds345597.mlab.com:45597/stint_v2")
  .then(() => {
    console.log("connected to mongoDB")
  },
  err => {
    console.log("err", err)
  }
  );
mongoose.Promise = global.Promise;

// ONBOARDING
router.post('/register-family', (req, res) => {
  const family = new Family({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  });
  family.save((err, result) => {
    if(err) {
      return res.status(500).json({errors: err})
    }
    //at this point save was success
    return res.status(200).json({
      family: result
    })
  })
})


module.exports = router;