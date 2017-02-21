const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a templating comment to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TEMPLATE_COMMENT)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        const text = data.get('text');

        return state
            .shift()
            .write(`{# ${text} #}`);
    });

/**
 * Deserialize a templating comment to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.comment, (state, match) => {
        if (state.getProp('template') === false) {
            return;
        }

        const node = Block.create({
            type: BLOCKS.TEMPLATE_COMMENT,
            isVoid: true,
            data: {
                text: match[1].trim()
            }
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
