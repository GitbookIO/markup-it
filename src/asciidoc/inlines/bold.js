const { Serializer, MARKS } = require('../../');

/**
 * Serialize a bold text to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedRange(MARKS.BOLD, (state, text, mark) => {
        return `*${text}*`;
    });

module.exports = { serialize };
