
//family reducer
const addPersonToFamilyData = (family, payload) => {
  console.log('familyData', family)
  console.log('person', payload)

  if(payload.parent) {
    family.familyData.parents.push(payload.parent)
  }

  if (payload.child) {
    family.familyData.children.push(payload.child)
  }

  return family.familyData;

}

const addChoreToFamilyData = (family, payload) => {
  family.familyData.chorelist=[...family.familyData.chorelist,payload.chore]
  return family.familyData;
}
const editChoreToFamilyData = (family, payload) => {
  let filteredChorelist=family.familyData.chorelist.filter(c=> {
    return (c!==payload.oldChore)? true: false;
  })
  //change in chorelist
  family.familyData.chorelist=[...filteredChorelist, payload.newChore];
  //chnage in schedule
  let schedulesArr=[];
  for(let schedule of family.familyData.schedules) {
    //Monday
    schedule['monday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['monday'][idx].chore=payload.newChore;
      }
    })
    //tuesday
    schedule['tuesday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['tuesday'][idx].chore=payload.newChore;
      }
    })
    //wednesday
    schedule['wednesday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['wednesday'][idx].chore=payload.newChore;
      }
    })
    //thursday
    schedule['thursday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['thursday'][idx].chore=payload.newChore;
      }
    })
    //friday
    schedule['friday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['friday'][idx].chore=payload.newChore;
      }
    })
    //saturday
    schedule['saturday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['saturday'][idx].chore=payload.newChore;
      }
    })
    //sunday
    schedule['sunday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['sunday'][idx].chore=payload.newChore;
      }
    })

    schedulesArr.push(schedule);
  }
      
  family.familyData.schedules=schedulesArr;
      

  return family.familyData;
}
//
const deleteChoreToFamilyData = (family, payload) => {
  family.familyData.chorelist=payload.newChoreList;

 //chnage in schedule
  let schedulesArr=[];
  for(let schedule of family.familyData.schedules) {
    //Monday
    schedule['monday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['monday'].splice(idx, 1)
      }
    })
    //tuesday
    schedule['tuesday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['tuesday'].splice(idx, 1)
      }
    })
    //wednesday
    schedule['wednesday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['wednesday'].splice(idx, 1)
      }
    })
    //thursday
    schedule['thursday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['thursday'].splice(idx, 1)
      }
    })
    //friday
    schedule['friday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['friday'].splice(idx, 1)
      }
    })
    //saturday
    schedule['saturday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['saturday'].splice(idx, 1)
      }
    })
    //sunday
    schedule['sunday'].forEach((choreObj,idx)=> {
      if(choreObj.chore===payload.oldChore) {
        schedule['sunday'].splice(idx, 1)
      }
    })

    schedulesArr.push(schedule);
  }
      
  family.familyData.schedules=schedulesArr;

  return family.familyData;
}

const updateScheduleToFamilyData = (family, payload) => {
  let filtered = family.familyData.schedules.filter(s=>{
    if(s.child_id===payload.newSchedule.child_id) {
      return false;
    }
    return true
  })
  filtered.push(payload.newSchedule)
  family.familyData.schedules=filtered;
  return family.familyData;
}

//REWARD
const addRewardToFamilyData = (family, payload) => {
  let filteredRewards = family.familyData.rewards.filter(r=>r.child_id !==payload.reward.child_id)
  family.familyData.rewards=[...filteredRewards,payload.reward];
  return family.familyData;
}
const editRewardInFamilyData = (family, payload) => {
  let filteredRewards = family.familyData.rewards.filter(r=>r.child_id !==payload.reward.child_id)
  family.familyData.rewards=[...filteredRewards,payload.reward];
  return family.familyData;
}
export default {
  addPersonToFamilyData,
  addChoreToFamilyData,
  editChoreToFamilyData,
  deleteChoreToFamilyData,
  updateScheduleToFamilyData,
  addRewardToFamilyData,
  editRewardInFamilyData
}