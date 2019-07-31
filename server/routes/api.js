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

//checkJWTtoken middleware
const checkJWT = (req, res, next) => {
  let token = jwt.verify(req.headers.authorization, tks);
  console.log('verified_token', token)
  if (token) {
    next();
  } else {
    return res.status(500).json({message: "Invalid/missing token. Please login"})
  }
}

// ONBOARDING
  //REGISTER FAM
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
  const salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.family_password, salt)
  // create a record
  const family = new Family({
    family_email: req.body.family_email,
    family_nickname: req.body.family_nickname,
    family_password: hash
  });
  family.save((err, result) => {
    if(err) {
      return res.status(500).json({error: err})
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
  //REGISTER PERSON
router.post('/register-person', [
  check('name').escape().trim().exists(),
  check("pin").escape().trim().exists(),
  check("person_type").exists(),
  check('family_id').exists()
], (req, res) => {
  passInputValidation(req, res);
  //at this point, it passed validation
  if(req.body.person_type === 'parent') {
    //hash pin
    const salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.pin, salt);
    //create the record
    const parent = new Parent({
      pin: hash,
      name: req.body.name,
      family_id: req.body.family_id
    });
    parent.save((err, result) => {
      if(err) {
        return res.status(500).json({error: err})
      }
       //at this point save was success
      //create family token
      const token = jwt.sign({id: result._id}, tks, {expiresIn: '2h'})
      return res.status(200).json({
        parent: result,
        token: token
      });
    });
    //#TODO: SAVE PARENT ID IN FAMILY
  }else if(req.body.person_type === 'child') {
    //hash pin
    const salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.pin, salt);
    //create the record
    const child = new Child({
      pin: hash,
      name: req.body.name,
      family_id: req.body.family_id
    });
    child.save((err, result) => {
      if(err) {
        return res.status(500).json({error: err})
      }
       //at this point save was success
      //create family token
      const token = jwt.sign({id: result._id}, tks, {expiresIn: '2h'})
      return res.status(200).json({
        child: result,
        token: token
      });
    });
    //#TODO: SAVE CHILD ID IN PARENT
  } 
  else {
    return res.status(500).json({error: "person type is needed"})
  }

})
  //LOGIN FAM
router.post('/login-family',[
  check('family_email').isEmail()
      .matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
      .escape().trim(),
  check('family_password').escape().trim().exists()
], (req, res) => {

  passInputValidation(req, res);
  //at this point it passed validation

  //check email, password credentials
  Family.find({family_email: req.body.family_email})
    .populate("parents")
    .populate("children")
    .exec()
    .then(family => {
      //compare password to what is on db
      bcrypt.compare(req.body.family_password, family[0].family_password, (err, same) => {
        if (err) {
          return res.status(500).json({message: "Wrong email/password"});
        }
        if (same) {
          //passwords match
            //create token
            const token = jwt.sign({id: family[0]._id}, tks, {expiresIn: '2h'});
            //send token and success message
            //also, send the family data obj
            return res.status(200).json({
              token,
              family: family[0]
            })
        } else {
          // not email/ password patch
          return res.status(500).json({message: 'Could not login. Try again later'});
        }
      })
    })
    .catch(error => {
      // family does not exist on server
      return res.status(500).json({message: "Family email does not exist in our records.", error: error});
    });
});

//PROTECTED ROUTES (go through JWTCheck Middleware)
//router.use(checkJWT)

router.get("/family-data", (req, res) => {
  //#TODO -set up route
  let reqToken= req.headers.authorization;
  let decodedJWT=jwt.verify(reqToken, tks);
  console.log('decoded', decodedJWT);
  Family.findOne({_id: decodedJWT.id})
    .populate('parent')
    .populate('child')
    .exec()
    .then(doc => {
      console.log('doc', doc)
      return res.status(200).json({
        family: doc
      });
    })
    .catch(err => {
      return res.status(500).json({message:"Could not retrieve family data"});
    });

})

module.exports = router;