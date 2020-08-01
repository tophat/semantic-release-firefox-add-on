const path = jest.requireActual('path')
const fs = jest.requireActual('fs')
const { vol } = require('memfs')
const { ufs } = require('unionfs')

const { createWriteStream } = ufs
ufs.createWriteStream = (...args) => {
    for (const _fs of ufs.fss) {
        try {
            if (_fs.existsSync(path.dirname(`${args[0]}`))) {
                return _fs.createWriteStream(args[0])
            }
        } catch (e) {
            continue
        }
    }
    return createWriteStream(...args)
}

module.exports = ufs.use(vol).use(fs)
Object.assign(module.exports, { constants: fs.constants })
