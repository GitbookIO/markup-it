const entities = require('entities');

/**
 * Escape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function escape(str) {
    return entities.encodeXML(str);
}

module.exports = escape;
