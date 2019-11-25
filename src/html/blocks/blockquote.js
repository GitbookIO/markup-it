import { BLOCKS } from '../../constants';
import { Serializer } from '../../models';
import serializeTag from '../serializeTag';

/**
 * Serialize a blockquote to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.BLOCKQUOTE)
    .then(serializeTag('blockquote'));

export default { serialize };
