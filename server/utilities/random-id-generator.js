const shortUUID = require('short-uuid');
const { randomUUID } = require('crypto');

const translator = shortUUID();

exports.generateUUID = () => {
    const UUID = randomUUID(); 
    return `order_${translator.fromUUID(UUID)}`;
}
