const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.MATH)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        const tex = data.get('tex');

        const output = '\n$$\n' + tex.trim() + '\n$$\n';

        return state
            .shift()
            .write(output);
    });


/**
 * Deserialize a math block into a paragraph with an inline math in it.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.math, (state, match) => {
        const tex = match[2].trim();

        if (state.getProp('math') === false || !tex) {
            return;
        }

        const node = Block.create({
            type: BLOCKS.MATH,
            isVoid: true,
            data: {
                tex
            }
        });

        return state.push(node);
    });


module.exports = { serialize, deserialize };
