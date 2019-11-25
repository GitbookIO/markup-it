import { decodeHTML } from 'entities';

/**
 * Unescape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
    return decodeHTML(str);
}

export default unescape;
