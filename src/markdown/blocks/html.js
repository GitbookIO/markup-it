import { Serializer, Deserializer, Block, BLOCKS } from '../../';
import reBlock from '../re/block';

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
    const node = Block.create({
        type: BLOCKS.HTML,
        isVoid: true,
        data: {
            html: match[0].trim()
        }
    });

    return state.push(node);
});

export default { serialize, deserialize };
