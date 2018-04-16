const entities = require('entities');

/**
 * Unescape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
    str = entities.decodeHTML(str);

    return str;
}

module.exports = unescape;
