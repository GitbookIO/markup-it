import { Serializer } from '../../';

/**
 * Serialize a text node to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('text')
    .then(state => {
        const node = state.peek();
        let { text } = node;

        // Hard-line breaks are newline in text nodes
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');

        return state.shift().write(text);
    });

export default { serialize };
