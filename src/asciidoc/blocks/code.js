const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a paragraph node to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then((state) => {
        const node = state.peek();
        const { nodes, data } = node;
        const syntax = data.get('syntax');

        const inner = nodes.reduce((output, line) => output + line.text + '\n', '');

        return state
            .shift()
            .write(`${syntax ? '[source,' + syntax + ']\n' : ''}---\n${inner}---\n\n`);
    });


module.exports = { serialize };
