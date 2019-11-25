import { INLINES } from '../../constants';
import { Serializer } from '../../models';
import serializeTag from '../serializeTag';

/**
 * Serialize an image to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.IMAGE)
    .then(
        serializeTag('img', {
            isSingleTag: true,
            getAttrs: node => ({
                src: node.data.get('src'),
                alt: node.data.get('alt')
            })
        })
    );

export default { serialize };
