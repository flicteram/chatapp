import axios from 'axios';
const URL = 'http://localhost:8080/api/'
// const URL = 'https://chatapp-pearl.vercel.app/api/'

export default axios.create({
  baseURL: URL,
  withCredentials: true,
})
const axiosPrivate = axios.create({
  baseURL: URL,
  withCredentials: true,
})

export { axiosPrivate }