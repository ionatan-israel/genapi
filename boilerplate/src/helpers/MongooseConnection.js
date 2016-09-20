import chalk from 'chalk'
import mongoose from 'mongoose'
import Promise from 'bluebird'

function MongooseMiddleware (req, res, next) {
  req.mongoose = mongoose
  req.models = mongoose.models
  return next()
}

export default function MongooseConnection (dbName) {
  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost/' + dbName, (err) => {
      if (err) return reject(err)
      mongoose.middleware = MongooseMiddleware
      mongoose.Promise = Promise
      mongoose.connection.on('error', (err) => console.log(chalk.red('Mongoose default connection error: ' + err)))
      mongoose.connection.on('disconnected', () => console.log(chalk.red('Mongoose default connection disconnected')))
      console.log(chalk.green('Mongoose connection open to mongodb://localhost/' + dbName))
      return resolve(mongoose)
    })
  })
}
