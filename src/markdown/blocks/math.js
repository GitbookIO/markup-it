import { Serializer, Deserializer, Block, BLOCKS } from '../../';
import reBlock from '../re/block';

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.MATH)
    .then(state => {
        const node = state.peek();
        const { data } = node;
        const formula = data.get('formula');

        const output = `$$\n${formula.trim()}\n$$\n\n`;

        return state.shift().write(output);
    });

/**
 * Deserialize a math block into a paragraph with an inline math in it.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reBlock.math, (state, match) => {
    const formula = match[2].trim();

    if (state.getProp('math') === false || !formula) {
        return undefined;
    }

    const node = Block.create({
        type: BLOCKS.MATH,
        isVoid: true,
        data: {
            formula
        }
    });

    return state.push(node);
});

export default { serialize, deserialize };
