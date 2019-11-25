import { BLOCKS } from '../../constants';
import { Serializer } from '../../models';
import serializeTag from '../serializeTag';

/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HR)
    .then(
        serializeTag('hr', {
            isSingleTag: true
        })
    );

export default { serialize };
