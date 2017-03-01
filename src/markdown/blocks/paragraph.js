const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a paragraph to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then((state) => {
        const node = state.peek();
        const inner = state
            .use('inline')
            .setProp('hardlineBreak', true)
            .serialize(node.nodes);

        return state
            .shift()
            .write(`${inner}\n\n`);
    });

/**
 * Deserialize a paragraph to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.paragraph, (state, match) => {
        const parentDepth = state.depth - 1;
        const isInBlockquote = (state.getProp('blockquote') === parentDepth);
        const isInLooseList = (state.getProp('looseList') === parentDepth);
        const isTop = (state.depth === 2);

        if (!isTop && !isInBlockquote && !isInLooseList) {
            return;
        }

        const text = match[1].trim();
        const nodes = state.use('inline').deserialize(text);
        const node = Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
