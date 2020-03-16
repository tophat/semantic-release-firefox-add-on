const path = jest.requireActual('path')
const fs = jest.requireActual('fs')
const { vol } = require('memfs')
const { ufs } = require('unionfs')

const { createWriteStream } = ufs
ufs.createWriteStream = (...args) => {
    const filePath = `${args[0]}`
    for (const _fs of ufs.fss) {
        try {
            if (
                _fs.existsSync(filePath) ||
                _fs.existsSync(path.dirname(filePath))
            ) {
                return _fs.createWriteStream(...args)
            }
        } catch (e) {
            continue
        }
    }
    return createWriteStream(...args)
}

module.exports = ufs.use(vol).use(fs)
