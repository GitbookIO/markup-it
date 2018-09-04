import { Serializer, BLOCKS } from '../../';
import serializeTag from '../serializeTag';

/**
 * Serialize a paragraph to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then(serializeTag('p'));

export default { serialize };
