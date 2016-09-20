import boom from 'boom'

export const err = (err, req, res, next) => {
  if (err.isBoom) {
    res.status(err.output.statusCode).send({...err.output.payload, errors: err.errors})
  } else {
    res.status(500).send(err.toString())
  }
}

export const notFound = (req, res, next) =>
  next(boom.notFound('missing'))
