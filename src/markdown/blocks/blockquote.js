import splitLines from 'split-lines';
import { Block } from '@gitbook/slate';
import { BLOCKS } from '../../constants';
import { Deserializer, Serializer } from '../../models';
import reBlock from '../re/block';

/**
 * Serialize a blockquote node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.BLOCKQUOTE)
    .then(state => {
        const node = state.peek();
        const inner = state.use('block').serialize(node.nodes);
        const lines = splitLines(inner.trim());

        const output = lines.map(line => (line ? `> ${line}` : '>')).join('\n');

        return state.shift().write(`${output}\n\n`);
    });

/**
 * Deserialize a blockquote to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reBlock.blockquote,
    (state, match) => {
        const inner = match[0].replace(/^ *> ?/gm, '').trim();
        const nodes = state
            .use('block')
            // Signal to children that we are in a blockquote
            .setProp('blockquote', state.depth)
            .deserialize(inner);
        const node = Block.create({
            type: BLOCKS.BLOCKQUOTE,
            nodes
        });

        return state.push(node);
    }
);

export default { serialize, deserialize };
