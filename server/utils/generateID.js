const { v4: uuidv4 } = require('uuid');

const generateID = () => {
    return uuidv4().replace(/-/g, '').substring(0, 5);
}

module.exports = { generateID };