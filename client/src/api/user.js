import agent from "./agent";

export default {
  getPersonData: (type, id) => {
    return new global.Promise((resolve, reject) => {
      agent.axios
        .post(`/${type}-data`, { id: id })
        .then(res => {
          return resolve(res.data);
        })
        .catch(err => reject(err));
    });
  }
};
