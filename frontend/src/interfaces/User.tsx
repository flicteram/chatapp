
export default interface IUser {
  user: {
    accessToken: string,
    username: string,
    _id: string,
    picture?:string
  }
}

export interface User {
  accessToken: string,
  username: string,
  _id: string
}