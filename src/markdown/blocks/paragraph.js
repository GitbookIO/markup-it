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
        const inner = state.use('inline').serialize(node.nodes);

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
        // const isInBlockquote = (state.get('blockquote') === state.getParentDepth());
        // const isInLooseList = (state.get('looseList') === state.getParentDepth());
        // const isTop = (state.getDepth() === 1);
        //
        // if (!isTop && !isInBlockquote && !isInLooseList) {
        //     return;
        // }
        const text = match[1].trim();
        const node = Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes: state.use('inline').deserialize(text)
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };