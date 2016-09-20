import { err, notFound } from './middlewares/errors'
import { Router } from 'express'
import ctrl from './controllers/'

const router = Router()
// Users
.get('/users', ctrl.users.list)
.post('/login', ctrl.users.auth)
.post('/register', ctrl.users.register)
.post('/users', ctrl.users.create)
// Middlewares
.use(err)
.use('*', notFound)

export default router
