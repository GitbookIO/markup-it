const { State, Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');
const HTMLParser = require('../../html');

/**
 * Serialize an HTML block to markdown
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
        const html = match[0].trim();
        // const node = Block.create({
        //     type: BLOCKS.HTML,
        //     isVoid: true,
        //     data: {
        //         html
        //     }
        // });

        const htmlState = State.create(HTMLParser);
        const document = htmlState.deserializeToDocument(html);

        return state.push(document.nodes);
    });

module.exports = { serialize, deserialize };
