import boom from 'boom'

export const auth = (req, res, next) =>
  req.models.user.auth(req.body)
  .then((jwt) => res.json(jwt))
  .catch((err) => next(boom.wrap(err, 401, 'bad credentials')))

export const create = (req, res, next) =>
  req.models.user.create(req.body)
  .then((user) => res.json(user))
  .catch((err) => next(boom.wrap(err, 400)))

export const list = (req, res, next) =>
  req.models.user.find({}).select('-password').exec()
  .then((user) => res.json(user))
  .catch((err) => next(boom.wrap(err, 500)))

export const register = (req, res, next) =>
  req.models.user.register(req.body)
  .then((jwt) => res.json(jwt))
  .catch((err) => next(boom.wrap(err, 400)))
