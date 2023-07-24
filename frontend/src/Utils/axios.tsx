import axios from 'axios';
// const URL = 'http://localhost:8080/api/'
// const URL = 'https://chat-api-h5m4.onrender.com/api/'
const URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/'

export default axios.create({
  baseURL: URL,
  withCredentials: true,
})
const axiosPrivate = axios.create({
  baseURL: URL,
  withCredentials: true,
})

export { axiosPrivate }