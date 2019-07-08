import agent from './agent';

export default {
  registerFam: (data) => {
    return new global.Promise((resolve, reject) => {
      let body = {
        family_nickname: data.family_nickname,
        family_email: data.family_email,
        family_password: data.family_password
      };
      agent.axios.post("/register-family", body)
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => reject(err));
    })
  },

}