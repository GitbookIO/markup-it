import entities from 'entities';

/**
 * Unescape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
    return entities.decodeHTML(str);
}

export default unescape;
