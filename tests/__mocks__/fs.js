const fs = jest.requireActual('fs')

const { ufs } = require('unionfs')
const { vol } = require('memfs')

module.exports = ufs.use(fs).use(vol)
