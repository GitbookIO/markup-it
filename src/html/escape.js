import { encodeXML } from 'entities';

/**
 * Escape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function escape(str) {
    return encodeXML(str);
}

export default escape;
