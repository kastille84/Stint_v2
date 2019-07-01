const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const { dbUser, dbPass, tks } = require('../config/config');

mongoose.connect("mongodb://"+dbUser+":"+dbPass+"@ds345597.mlab.com:45597/stint_v2")
  .then(() => {
    console.log("connected to mongoDB")
  },
  err => {
    console.log("err", err)
  }
  );
mongoose.Promise = global.Promise;


module.exports = router;