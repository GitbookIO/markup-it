const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize an HR to asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HR)
    .then((state) => {
        return state
            .shift()
            .write(`'''\n\n`);
    });

module.exports = { serialize };
