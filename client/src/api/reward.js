import agent from './agent';

export default {

  addReward: (child_id, reward) => {
    return new global.Promise((resolve, reject) => {
      agent.axios.put("/add-reward", {child_id, ...reward})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => reject(err));
    })
  },

}