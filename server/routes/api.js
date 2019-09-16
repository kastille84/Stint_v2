const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { dbUser, dbPass, tks } = require("../config/config");
//models
const Family = require("../models/family");
const Parent = require("../models/parent");
const Child = require("../models/child");
const Schedule = require("../models/schedule");
const Reward = require("../models/reward");

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 1000, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 1000,
  useNewUrlParser: true
};

//mongoose.connect("mongodb://"+dbUser+":"+dbPass+"@ds345597.mlab.com:45597/stint_v2", options)
mongoose.connect("mongodb://localhost:27017/stint_v2", options).then(
  () => {
    console.log("connected to mongoDB");
  },
  err => {
    console.log("err", err);
  }
);
mongoose.Promise = global.Promise;

//validation helper function
const passInputValidation = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: "Invalid inputs. Try again" });
  }
};

//checkJWTtoken middleware
const checkJWT = (req, res) => {
  let token = jwt.verify(req.headers.authorization, tks);
  if (!token) {
    return res
      .status(500)
      .json({ message: "Invalid/missing token. Please login" });
  }
};

// ONBOARDING
//REGISTER FAM
router.post(
  "/register-family",
  [
    check("family_nickname")
      .escape()
      .trim()
      .exists(),
    check("family_email")
      .isEmail()
      .matches(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
      .escape()
      .trim(),
    check("family_password")
      .escape()
      .trim()
      .exists()
  ],
  (req, res) => {
    passInputValidation(req, res);
    //at this point it passed validation

    //hash password
    const salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.family_password, salt);
    // create a record
    const family = new Family({
      family_email: req.body.family_email,
      family_nickname: req.body.family_nickname,
      family_password: hash
    });
    family.save((err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      //at this point save was success
      //create family token
      const token = jwt.sign({ id: result._id }, tks);
      return res.status(200).json({
        family: result,
        token: token
      });
    });
  }
);
//REGISTER PERSON
router.post(
  "/register-person",
  [
    check("name")
      .escape()
      .trim()
      .exists(),
    check("pin")
      .escape()
      .trim()
      .exists(),
    check("person_type").exists(),
    check("family_id").exists()
  ],
  (req, res) => {
    passInputValidation(req, res);
    //at this point, it passed validation
    let personId;
    if (req.body.person_type === "parent") {
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
        if (err) {
          console.log("errorFam", err);
          return res.status(500).json({ error: err });
        }
        //at this point save was success
        //create family token
        //const token = jwt.sign({id: result._id}, tks, {expiresIn: '2h'})
        //set personId for storing in Family schema
        personId = result._id;
        Family.findOne({ _id: req.body.family_id })
          .exec()
          .then(fam => {
            fam.parents = [...fam.parents, personId];
            fam.save((err, famDoc) => {
              if (err) return res.status(500).json({error: err})
              //send response
              return res.status(200).json({
                type: 'parent',
                familyData: famDoc
                //token: token
              });
            });
          })
          .catch();
      });
      //#TODO: SAVE PARENT ID IN FAMILY
    } else if (req.body.person_type === "child") {
      //hash pin
      const salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.pin, salt);
      //create the record
      const child = new Child({
        pin: hash,
        name: req.body.name,
        family_id: req.body.family_id
      });
      child.save((err, childDoc) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        //at this point save was success
        // create a schedule record for the child
        const schedule = new Schedule({
          family_id: req.body.family_id,
          child_id: childDoc._id
        });
        schedule.save((err, scheduleDoc) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          // schedule save was successful
          // create a reward record for the child
          const reward = new Reward({
            family_id: req.body.family_id,
            child_id: childDoc._id
          });
          reward.save((err, rewardDoc) => {
            if (err) {
              return res.status(500).json({ error: err });
            }
            // reward save was successful
            //set personId for storing in Family schema
            personId = childDoc._id;
            Family.findOne({ _id: req.body.family_id })
              .exec()
              .then(fam => {
                fam.children = [...fam.children, personId];
                fam.schedules = [...fam.schedules, scheduleDoc._id];
                fam.rewards = [...fam.rewards, rewardDoc._id];
                fam.save( (err, famDoc) => {
                  if (err) return res.status(500).json({error: err})
                  return res.status(200).json({type: "child",familyData:famDoc})
                });
              })
              .catch();
          });
        });
      });
    } else {
      return res.status(500).json({ error: "person type is needed" });
    }
  }
);
//LOGIN FAM
router.post(
  "/login-family",
  [
    check("family_email")
      .isEmail()
      .matches(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
      .escape()
      .trim(),
    check("family_password")
      .escape()
      .trim()
      .exists()
  ],
  (req, res) => {
    passInputValidation(req, res);
    //at this point it passed validation

    //check email, password credentials
    Family.find({ family_email: req.body.family_email })
      .populate("parents")
      .populate("children")
      .exec()
      .then(family => {
        //compare password to what is on db
        bcrypt.compare(
          req.body.family_password,
          family[0].family_password,
          (err, same) => {
            if (err) {
              return res.status(500).json({ message: "Wrong email/password" });
            }
            if (same) {
              //passwords match
              //create token
              const token = jwt.sign({ id: family[0]._id }, tks);
              //send token and success message
              //also, send the family data obj
              return res.status(200).json({
                token,
                family: family[0]
              });
            } else {
              // not email/ password patch
              return res
                .status(500)
                .json({ message: "Could not login. Try again later" });
            }
          }
        );
      })
      .catch(error => {
        // family does not exist on server
        return res
          .status(500)
          .json({
            message: "Family email does not exist in our records.",
            error: error
          });
      });
  }
);

//PROTECTED ROUTES (go through JWTCheck Middleware)
//router.use(checkJWT)

router.get("/family-data", (req, res) => {
  let reqToken = req.headers.authorization;
  let decodedJWT = jwt.verify(reqToken, tks);
  Family.findOne({ _id: decodedJWT.id })
    .populate("parents")
    .populate("children")
    .populate("schedules")
    .populate("rewards")
    .exec()
    .then(doc => {
      return res.status(200).json({
        family: doc
      });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ message: "Could not retrieve family data" });
    });
});

router.post(
  "/login-person",
  [
    check("pin")
      .exists()
      .trim()
  ],
  (req, res) => {
    checkJWT(req, res);
    passInputValidation(req, res);

    if (req.body.person_type === "parent") {
      Parent.findById(req.body.person_id)
        .exec()
        .then(parent => {
          bcrypt.compare(req.body.pin, parent.pin, (err, same) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Could not verify. Try again" });
            if (same) {
              //create parent_jwt
              const token = jwt.sign({ id: parent._id }, tks);
              return res.status(200).json({
                parent: parent,
                token: token
              });
            } else {
              return res.status(500).json({ message: "Wrong pin. Try again" });
            }
          });
        })
        .catch(err => {
          return res
            .status(500)
            .json({ message: "Could Not Log In. Try again" });
        });
    } else {
      Child.findById(req.body.person_id)
        .exec()
        .then(child => {
          bcrypt.compare(req.body.pin, child.pin, (err, same) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Could not verify. Try again" });
            if (same) {
              //create child_jwt
              const token = jwt.sign({ id: child._id }, tks);
              return res.status(200).json({
                child: child,
                token: token
              });
            } else {
              return res.status(500).json({ message: "Wrong pin. Try again" });
            }
          });
        })
        .catch(err => {
          return res
            .status(500)
            .json({ message: "Could Not Log In. Try again" });
        });
    }
  }
);

// GET PARENT DATA
router.post("/parent-data", (req, res) => {
  Parent.findOne({ _id: req.body.id })
    .exec()
    .then(parent => {
      return res.status(200).json({
        parent: parent
      });
    })
    .catch(err =>
      res.status(500).json({ message: "Could Not Get Parent Data" })
    );
});
// GET Child DATA
router.post("/child-data", (req, res) => {
  Child.findOne({ _id: req.body.id })
    .exec()
    .then(child => {
      return res.status(200).json({
        child: child
      });
    })
    .catch(err =>
      res.status(500).json({ message: "Could Not Get Child Data" })
    );
});

// CHORES
router.post(
  "/add-chore",
  [
    check("chore")
      .exists()
      .trim()
  ],
  (req, res) => {
    checkJWT(req, res);
    passInputValidation(req, res);

    //find family
    let reqToken = req.headers.authorization;
    let decodedJWT = jwt.verify(reqToken, tks);
    Family.findOne({ _id: decodedJWT.id })
      .exec()
      .then(family => {
        //check if chore already exist
        if (family.chorelist.includes(req.body.chore)) {
          //if exists return 500
          return res.status(500).json({ message: "Chore already exists" });
        } else {
          //if not add chore
          family.chorelist.push(req.body.chore);
          family.save((err, famDoc) => {
            if (err) {
              return res.status(500).json({ message: "Could not save chore" });
            }
            Schedule.find({'family_id': family._id}).exec()
              .then(scheds => {
                return res
                .status(200)
                .json({ chore: req.body.chore, 
                  schedules: scheds,
                  message: "Chore saved" });
              })
              .catch(err => {
                return res.status(500).json({error: err, message: "Could not save chore" });
              });
          });
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ message: "Could not retrieve family data", err: err });
      });
  }
);

router.put(
  "/edit-chore",
  [
    check("newChore")
      .exists()
      .trim()
  ],
  (req, res) => {
    checkJWT(req, res);
    passInputValidation(req, res);

    //find family
    let reqToken = req.headers.authorization;
    let decodedJWT = jwt.verify(reqToken, tks);
    Family.findOne({ _id: decodedJWT.id })
      .exec()
      .then(family => {
        //find chore
        const newChoreListArr = family.chorelist.filter(c => {
          return c !== req.body.oldChore ? true : false;
        });
        //update the chore chore
        family.chorelist = [...newChoreListArr, req.body.newChore];
        family.save((err, result) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          //at this point save was success
          //#TODO - change chore for each child in Schedule
          let promiseArr = [];
          Schedule.find({ family_id: family._id })
            .exec()
            .then(schedules => {
              for (let schedule of schedules) {
                //Monday
                schedule["monday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["monday"][idx].chore = req.body.newChore;
                  }
                });
                //tuesday
                schedule["tuesday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["tuesday"][idx].chore = req.body.newChore;
                  }
                });
                //wednesday
                schedule["wednesday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["wednesday"][idx].chore = req.body.newChore;
                  }
                });
                //thursday
                schedule["thursday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["thursday"][idx].chore = req.body.newChore;
                  }
                });
                //friday
                schedule["friday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["friday"][idx].chore = req.body.newChore;
                  }
                });
                //saturday
                schedule["saturday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["saturday"][idx].chore = req.body.newChore;
                  }
                });
                //sunday
                schedule["sunday"].forEach((choreObj, idx) => {
                  if (choreObj.chore === req.body.oldChore) {
                    schedule["sunday"][idx].chore = req.body.newChore;
                  }
                });
                promiseArr.push(schedule.save());
              }
            });
          Promise.all(promiseArr)
            .then(result => {
              return res.status(200).json({
                newChore: req.body.newChore,
                oldChore: req.body.oldChore
              });
            })
            .catch(err => {
              return res
                .status(500)
                .json({ message: "Could not update schedules", err: err });
            });
        });
      })
      .catch(err => {
        return res
          .status(500)
          .json({ message: "Could not retrieve family data", err: err });
      });
  }
);

router.delete("/delete-chore/:chore", (req, res) => {
  checkJWT(req, res);
  passInputValidation(req, res);

  //find family
  let reqToken = req.headers.authorization;
  let decodedJWT = jwt.verify(reqToken, tks);
  Family.findOne({ _id: decodedJWT.id })
    .exec()
    .then(family => {
      //find chore
      const newChoreListArr = family.chorelist.filter(c => {
        return c !== req.params.chore ? true : false;
      });
      //update the chore chore
      family.chorelist = newChoreListArr;
      family.save((err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        //at this point save was success
        //#TODO - delete chore for each child in Schedule
        let promiseArr = [];
        Schedule.find({ family_id: family._id })
          .exec()
          .then(schedules => {
            for (let schedule of schedules) {
              //Monday
              schedule["monday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["monday"].splice(idx, 1);
                }
              });
              //tuesday
              schedule["tuesday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["tuesday"].splice(idx, 1);
                }
              });
              //wednesday
              schedule["wednesday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["wednesday"].splice(idx, 1);
                }
              });
              //thursday
              schedule["thursday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["thursday"].splice(idx, 1);
                }
              });
              //friday
              schedule["friday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["friday"].splice(idx, 1);
                }
              });
              //saturday
              schedule["saturday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["saturday"].splice(idx, 1);
                }
              });
              //sunday
              schedule["sunday"].forEach((choreObj, idx) => {
                if (choreObj.chore === req.params.chore) {
                  schedule["sunday"].splice(idx, 1);
                }
              });
              promiseArr.push(schedule.save());
            }
          });
        Promise.all(promiseArr)
          .then(result => {
            return res.status(200).json({
              newChoreList: newChoreListArr,
              oldChore: req.params.chore
            });
          })
          .catch(err => {
            return res
              .status(500)
              .json({ message: "Could not update schedules", err: err });
          });
      });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ message: "Could not retrieve family data", err: err });
    });
});

router.put("/save-schedule", (req, res) => {
  checkJWT(req, res);
  passInputValidation(req, res);

  //find schedule
  Schedule.findOne({ _id: req.body.schedule._id })
    .exec()
    .then(schedule => {
      schedule.monday = req.body.schedule.monday;
      schedule.tuesday = req.body.schedule.tuesday;
      schedule.wednesday = req.body.schedule.wednesday;
      schedule.thursday = req.body.schedule.thursday;
      schedule.friday = req.body.schedule.friday;
      schedule.saturday = req.body.schedule.saturday;
      schedule.sunday = req.body.schedule.sunday;
      schedule.save((err, scheduleDoc) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Could not update schedules", err: err });
        }
        return res.status(200).json({ newSchedule: scheduleDoc });
      });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ message: "Could not retrieve schedule data", err: err });
    });
});

// REWARDS
// Add-rewrad
router.put(
  "/add-reward",
  [
    check("reward_name")
      .exists()
      .trim(),
    check("reward_goal")
      .exists()
      .trim()
      .isNumeric()
  ],
  (req, res) => {
    checkJWT(req, res);
    passInputValidation(req, res);

    Reward.findOne({child_id: req.body.child_id}).exec()
      .then(reward => {
        reward.reward_name = req.body.reward_name,
        reward.reward_goal = req.body.reward_goal,
        reward.save((err, rewardDoc) => {
          if(err){return res.status(500).json({error: err})}
          return res.status(200).json({reward: rewardDoc})
        })
      })
      .catch(err => {
        return res.status(500).json({error: err})
      })
  }
);
// Add-rewrad
router.put(
  "/edit-reward",
  [
    check("reward_name")
      .exists()
      .trim(),
    check("reward_goal")
      .exists()
      .trim()
      .isNumeric()
  ],
  (req, res) => {
    checkJWT(req, res);
    passInputValidation(req, res);

    Reward.findOne({child_id: req.body.child_id}).exec()
      .then(reward => {
        if(!reward){return res.status(500).send({error:"Could not find reward for this child"})}
        reward.reward_name = req.body.reward_name,
        reward.reward_goal = req.body.reward_goal,
        reward.save((err, rewardDoc) => {
          if(err){return res.status(500).json({error: err})}
          return res.status(200).json({reward: rewardDoc})
        })
      })
      .catch(err => {
        return res.status(500).json({error: err.error})
      })
  }
);

// Add-subtract-rewrad -goal
router.put(
  "/add-subtract-goal",
  [
    check("type")
      .exists()
      .trim(),
    check("val")
      .exists()
      .isNumeric()
  ],
  (req, res) => {
    checkJWT(req, res);
    passInputValidation(req, res);

    Reward.findOne({child_id: req.body.child_id}).exec()
      .then(reward => {
        if (req.body.type==='subtract') {
          let num = reward.reward_currently - req.body.val;
          if (num < 0) {
            throw new Error('Cannot subtract. It results in negative value.')
          }
          reward.reward_currently = num;
          //calculate percentage
          reward.reward_status = (num / reward.reward_goal) * 100;            
        } else if (req.body.type==='add') {
          let num = reward.reward_currently + req.body.val;
          if (num > reward.reward_goal) {
            throw new Error('Cannot add. It results in value more than the goal.')
          }
          reward.reward_currently = num;
          //calculate percentage
          reward.reward_status = (num / reward.reward_goal) * 100; 
        }

        reward.save((err, rewardDoc) => {
          if(err){return res.status(500).json({error: err})}
          return res.status(200).json({reward: rewardDoc})
        })
      })
      .catch(err => {
        return res.status(500).json({error: err})
      })
  }
);

module.exports = router;
