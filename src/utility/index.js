// import numeral from 'numeral'
import axios from "axios";
import _ from "lodash";
import moment from "moment";

const STORAGE_TOKEN_KEY = process.env.REACT_APP_STORAGE_TOKEN_KEY;
const URL_API = process.env.REACT_APP_URL_API;

function getToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

function setToken(value) {
  if (value == null) {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  } else {
    localStorage.setItem(STORAGE_TOKEN_KEY, value);
  }
}

export {
    _,
    moment,
    // numeral,
    axios,
    getToken,
    setToken,
    URL_API,
};

