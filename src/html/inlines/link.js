import { INLINES } from '../../constants';
import { Serializer } from '../../models';
import serializeTag from '../serializeTag';

/**
 * Serialize a link to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.LINK)
    .then(
        serializeTag('a', {
            getAttrs: ({ data }) => ({
                href: data.get('href') || '',
                title: data.get('title') || undefined
            })
        })
    );

export default { serialize };
