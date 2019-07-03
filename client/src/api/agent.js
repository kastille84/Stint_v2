import axios from 'axios';
//import {store} from '../index.js';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = ""
} else {
  axios.defaults.baseURL = "http://localhost:5000/api";
}

const setSession = security_token => {
  window.localStorage.setItem("jwt", security_token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${security_token}`;
}

const getSession = () => {
  let security_token = window.localStorage.getItem("jwt");
  axios.defaults.headers.common["Authorization"] = `Bearer ${security_token}`;
  return security_token;
}

const clearSession = () => {
  window.localStorage.removeItem("jwt");
  axios.defaults.headers.common["Authorization"] = "";
}

getSession();

export default {
  axios,
  setSession,
  getSession,
  clearSession
}