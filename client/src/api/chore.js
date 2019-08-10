import agent from './agent';

export default {

  //CHORES
  addChore: (data) => {
    return new global.Promise((resolve, reject) => {
      agent.axios.post("/add-chore", {chore:data})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => reject(err));
    })
  },
  editChore: (data) => {
    return new global.Promise((resolve, reject) => {
      agent.axios.put('/edit-chore', {oldChore:data.oldChore, newChore:data.newChore})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err=>reject(err));
    })
  }

}