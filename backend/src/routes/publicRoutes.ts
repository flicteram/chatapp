import refreshRouter from '../api/refresh.js'
import logoutRouter from '../api/logout.js'
import registerRouter from '../api/register.js'
import authRouter from '../api/auth.js'
import googleRouter from '../api/googleAuth.js'
import { Express } from 'express'

export default function publicRoutes( app: Express ){
  app.use( '/api/register', registerRouter )
  app.use( '/api/auth', authRouter )
  app.use( '/api/googleAuth', googleRouter )
  app.use( '/api/logout', logoutRouter )
  app.use( '/api/refresh', refreshRouter )
}