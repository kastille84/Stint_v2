import axios from 'axios';
import {store} from '../index.js';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = ""
} else {
  axios.defaults.baseURL = "http://localhost:5000/api";
}

const setSession = (jwt_name,security_token) => {
  window.localStorage.setItem(jwt_name, security_token);
  axios.defaults.headers.common["Authorization"] = `${security_token}`;
}

const getSession = () => {
  let security_token = window.localStorage.getItem('family_jwt');
  axios.defaults.headers.common["Authorization"] = `${security_token}`;
  return security_token;
}

const clearSession = (jwt_name) => {
  window.localStorage.removeItem(jwt_name);
  axios.defaults.headers.common["Authorization"] = "";
}

getSession();

export default {
  axios,
  setSession,
  getSession,
  clearSession
}