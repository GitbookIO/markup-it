const { Serializer } = require('../');

/**
 * Default rule to serialize to HTML. Should be removed in the end.
 * @type {Serializer}
 */
const serialize = Serializer().then(state => state.shift());

module.exports = { serialize };
