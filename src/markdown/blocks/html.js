const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize an HR to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HTML)
    .then((state) => {
        const node = state.peek();
        const { data } = node;

        return state
            .shift()
            .write(`${data.get('html').trim()}\n\n`);
    });

/**
 * Deserialize an HTML block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.html, (state, match) => {
        const node = Block.create({
            type: BLOCKS.HTML,
            isVoid: true,
            data: {
                html: match[0]
            }
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
