import boom from 'boom'
import jwt from 'jsonwebtoken'

export default function authorize (req, res, next) {
  const token = req.headers.authorization ? req.headers.authorization.replace(/(JWT\s)/, '') : null
  if (!token) return next(boom.unauthorized())
  jwt.verify(token, 'blackGoku', function cbverify (err, data) {
    if (err) return next(boom.unauthorized(err))
    req.user = data
    return next()
  })
}
