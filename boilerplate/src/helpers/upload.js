import fs from 'fs'
import bluebird from 'bluebird'

const readFile = bluebird.promisify(fs.readFile)
const writeFile = bluebird.promisify(fs.writeFile)

const upload = (array) =>
  bluebird.each(array, (file) =>
    readFile(file.path).then((img) => writeFile('/tmp/' + file.filename, img)))

export default upload
