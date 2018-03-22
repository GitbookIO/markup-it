const { Serializer, MARKS } = require('../../');

/**
 * Serialize a italic text to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.ITALIC, (state, text, mark) => {
        return `__${text}__`;
    });

module.exports = { serialize };
