import entities from 'entities';

/**
 * Escape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function escape(str) {
    return entities.encodeXML(str);
}

export default escape;
