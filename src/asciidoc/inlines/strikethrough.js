const { Serializer, MARKS } = require('../../');

/**
 * Serialize a strikethrough text to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.STRIKETHROUGH, (state, text, mark) => {
        return `[line-through]#${text}#`;
    });

module.exports = { serialize };
