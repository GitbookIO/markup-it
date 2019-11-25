import { BLOCKS } from '../../constants';
import { State, Serializer, Deserializer } from '../../models';
import reBlock from '../re/block';
import { HTMLParser } from '../../html';

/**
 * Serialize an HTML block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HTML)
    .then(state => {
        const node = state.peek();
        const { data } = node;

        return state.shift().write(`${data.get('html').trim()}\n\n`);
    });

/**
 * Deserialize an HTML block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reBlock.html, (state, match) => {
    const html = match[0].trim();

    const htmlState = State.create(HTMLParser);
    const document = htmlState.deserializeToDocument(html);

    const firstNode = document.nodes.first();
    const documentIsEmpty =
        document.nodes.size === 1 &&
        firstNode.type === BLOCKS.PARAGRAPH &&
        firstNode.text === '';

    if (documentIsEmpty) {
        return state;
    }

    return state.push(document.nodes);
});

export default { serialize, deserialize };
