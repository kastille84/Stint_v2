import agent from './agent';

export default {

  saveSchedule: (child_id, schedule) => {
    return new global.Promise((resolve, reject) => {
      agent.axios.put("/save-schedule", {child_id, schedule})
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => reject(err));
    })
  },

}