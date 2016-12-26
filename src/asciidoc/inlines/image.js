const { Serializer, INLINES } = require('../../');

/**
 * Serialize an image to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.IMAGE)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        const src = data.get('src', '');
        const alt = data.get('alt', '');

        return state
            .shift()
            .write(`image:${src}[${alt}]`);
    });

module.exports = { serialize };
