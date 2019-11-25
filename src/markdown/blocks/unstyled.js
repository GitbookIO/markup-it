import { Block } from '@gitbook/slate';
import { BLOCKS } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import reBlock from '../re/block';

/**
 * Serialize a unstyled node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TEXT)
    .then(state => {
        const node = state.peek();
        const inner = state.use('inline').serialize(node.nodes);

        return state.shift().write(`${inner}\n`);
    });

/**
 * Deserialize a unstyle text to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reBlock.text, (state, match) => {
    const inner = match[0];
    const nodes = state.use('inline').deserialize(inner);
    const node = Block.create({
        type: BLOCKS.TEXT,
        nodes
    });

    return state.push(node);
});

export default { serialize, deserialize };
