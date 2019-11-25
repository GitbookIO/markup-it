import { Block } from '@gitbook/slate';
import { BLOCKS } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import reBlock from '../re/block';

/**
 * Serialize a footnote to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.FOOTNOTE)
    .then(state => {
        const node = state.peek();
        const inner = state.use('inline').serialize(node.nodes);
        const id = node.data.get('id');

        return state.shift().write(`[^${id}]: ${inner}\n\n`);
    });

/**
 * Deserialize a footnote to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reBlock.footnote,
    (state, match) => {
        const id = match[1];
        const text = match[2];
        const nodes = state.use('inline').deserialize(text);
        const node = Block.create({
            type: BLOCKS.FOOTNOTE,
            nodes,
            data: { id }
        });

        return state.push(node);
    }
);

export default { serialize, deserialize };
