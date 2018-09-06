import { Serializer } from '../';

/**
 * Default rule to serialize to HTML, that simply ignore the node.
 * Should be removed in the end.
 * @type {Serializer}
 */
const serialize = Serializer().then(state => state.shift());

export default { serialize };
