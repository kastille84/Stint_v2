import agent from './agent';

export default {
  registerFam: (data) => {
    return new global.Promise((resolve, reject) => {
      let body = {
        name: data.name,
        email: data.email,
        password: data.password
      };
      agent.axios.post("/register-family", body)
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => reject(err));
    })
  },

}