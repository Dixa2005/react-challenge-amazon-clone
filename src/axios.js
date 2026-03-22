import axios from "axios";

const instance = axios.create({
  // Our NEW Node.js & Express Backend API
  baseURL: 'http://localhost:5000'
});

export default instance;


