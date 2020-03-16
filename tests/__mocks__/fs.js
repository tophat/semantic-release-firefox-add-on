const fs = jest.requireActual('fs')
const { vol } = require('memfs')
const { ufs } = require('unionfs')

module.exports = ufs.use(vol).use(fs)
