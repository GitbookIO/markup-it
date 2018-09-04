import { Serializer, BLOCKS } from '../../';
import serializeTag from '../serializeTag';

/**
 * Serialize a blockquote to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.BLOCKQUOTE)
    .then(serializeTag('blockquote'));

export default { serialize };
