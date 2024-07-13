const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if (error) {
                reject(error)
            }
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    reject(error)
                }
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => {
    return bcrypt.compareSync(password, hashed)
}

module.exports = {
    hashPassword,
    comparePassword
}