import { INLINES } from '../../constants';
import { Serializer } from '../../models';

/**
 * Serialize an HTML inline to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.HTML)
    .then(state => {
        const node = state.peek();
        const {
            html,
            openingTag,
            closingTag,
            innerHtml
        } = node.data.toObject();
        if (html) {
            // Legacy format
            return state.shift().write(html);
        } else if (innerHtml) {
            return state
                .shift()
                .write(openingTag)
                .write(innerHtml)
                .write(closingTag);
        }
        return state
            .shift()
            .write(openingTag)
            .write(state.serialize(node.nodes))
            .write(closingTag);
    });

export default { serialize };
