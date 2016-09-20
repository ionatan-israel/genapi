import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import models from './models/index'  // eslint-disable-line
import mongoose from 'mongoose'  // eslint-disable-line
import MongooseConnection from './helpers/MongooseConnection'
import morgan from 'morgan'
import router from './router'

const app = express()
const server = http.createServer(app)

MongooseConnection('dbName').then((mongoose) => {
  app
  .use(cors())
  .use(urlencoded({ extended: false }))
  .use(json())
  .use(mongoose.middleware)
  .use(morgan('dev'))
  .use('/', router)
  .use('/static', express.static('/tmp/uploads')) // for recreational purposes only ;)

  server.listen(3002, () => console.log('listening por 3002'))
})
.catch((err) => console.log(err))
