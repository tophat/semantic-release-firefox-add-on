const { fs } = require('memfs')
const { ufs } = require('unionfs')

const actualFS = jest.requireActual('fs')

module.exports = { ...actualFS, ...ufs.use(actualFS).use(fs) }
