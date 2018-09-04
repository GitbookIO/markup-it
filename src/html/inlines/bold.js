const { Serializer, MARKS } = require('../../');

/**
 * Serialize a bold text to HTML
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.BOLD,
    (state, text, mark) => `<b>${text}</b>`
);

module.exports = { serialize };
