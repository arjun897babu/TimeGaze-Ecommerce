const shortUUID = require('short-uuid');
const { randomUUID } = require('crypto');

const translator = shortUUID();

exports.generateUUID = () => {
    const UUID = randomUUID(); 
    return translator.fromUUID(UUID);
}
