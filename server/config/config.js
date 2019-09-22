require('dotenv').config()

const dbPass = process.env.PASS || process.env.REACT_APP_PASS;
const dbUser = process.env.USER || process.env.REACT_APP_USER;
const tks = process.env.TKS || process.env.REACT_APP_TKS;

module.exports = {
  dbPass,
  dbUser,
  tks
}
