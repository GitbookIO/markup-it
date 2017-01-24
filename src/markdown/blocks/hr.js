const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize an HR to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HR)
    .then((state) => {
        const { depth, text } = state;

        const isFirstNode = depth == 1 && !text;

        return state
            .shift()
            .write(`${isFirstNode ? '\n' : ''}---\n\n`);
    });

/**
 * Deserialize an HR to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.hr, (state, match) => {
        const node = Block.create({
            type: BLOCKS.HR,
            isVoid: true
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
