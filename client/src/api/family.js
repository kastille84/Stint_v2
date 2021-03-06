import agent from "./agent";

export default {
  registerFam: data => {
    return new global.Promise((resolve, reject) => {
      let body = {
        family_nickname: data.family_nickname,
        family_email: data.family_email,
        family_password: data.family_password
      };
      agent.axios
        .post("/register-family", body)
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  registerPerson: data => {
    return new global.Promise((resolve, reject) => {
      agent.axios
        .post("/register-person", data)
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  loginFam: data => {
    return new global.Promise((resolve, reject) => {
      let body = {
        family_email: data.family_email,
        family_password: data.family_password
      };
      agent.axios
        .post("/login-family", body)
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  loginPerson: data => {
    return new global.Promise((resolve, reject) => {
      let body = {
        pin: data.pin,
        person_type: data.person_type,
        person_id: data.person_id
      };
      agent.axios
        .post("/login-person", body)
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  getFam: () => {
    return new global.Promise((resolve, reject) => {
      agent.axios
        .get("/family-data")
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  },
  deleteChild: child_id => {
    return new global.Promise((resolve, reject) => {
      agent.axios
        .delete(`/delete-child/${child_id}`)
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  }
};
