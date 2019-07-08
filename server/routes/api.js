const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const {check, validationResult} = require('express-validator/check')
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

//validation helper function
const passInputValidation = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({error: "Invalid inputs. Try again"});
  }  
}

// ONBOARDING
router.post('/register-family',[
  check('family_nickname').escape().trim().exists(),
  check('family_email').isEmail()
      .matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
      .escape().trim(),
  check('family_password').escape().trim().exists()
], (req, res) => {

  passInputValidation(req, res);
  //at this point it passed validation

  //hash password
  const salt = bcrypt.genSaltSync(10);;
  let hash = bcrypt.hashSync(req.body.family_password.toLowerCase(), salt)
  // create a record
  const family = new Family({
    family_email: req.body.family_email,
    family_nickname: req.body.family_nicknamez,
    family_password: hash
  });
  family.save((err, result) => {
    if(err) {
      return res.status(500).json({error: err._message})
    }
    //at this point save was success
    //create family token
    const token = jwt.sign({id: result._id}, tks, {expiresIn: '2h'})
    return res.status(200).json({
      family: result,
      token: token
    });
  })
})


module.exports = router;