import { Serializer, INLINES } from '../../';
import serializeTag from '../serializeTag';
import escape from '../escape';

/**
 * Serialize a link to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.LINK)
    .then(
        serializeTag('a', {
            getAttrs: ({ data }) => ({
                href: escape(data.get('href') || ''),
                title: data.get('title') ? escape(data.get('title')) : undefined
            })
        })
    );

export default { serialize };
