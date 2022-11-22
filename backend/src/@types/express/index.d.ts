interface ICurrentUser {
  username: string,
  _id: string
}

declare namespace Express {
  interface Request {
    currentUser: ICurrentUser
  }
}