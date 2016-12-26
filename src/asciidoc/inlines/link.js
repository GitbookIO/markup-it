const { Serializer, INLINES } = require('../../');

/**
 * Serialize a link to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.LINK)
    .then((state) => {
        const node = state.peek();
        const { nodes, data } = node;
        const href = data.get('href', '');
        const inner = state.use('inline').serialize(nodes);

        return state
            .shift()
            .write(`link:${href}[${inner}]`);
    });

module.exports = { serialize };
