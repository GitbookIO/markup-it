import { BLOCKS } from '../../constants';
import { Serializer } from '../../models';
import serializeTag from '../serializeTag';

/**
 * Serialize a paragraph to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then(serializeTag('p'));

export default { serialize };
