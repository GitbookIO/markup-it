const { Serializer, MARKS } = require('../../');

/**
 * Serialize a bold text to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.UNDERLINE, (state, text, mark) => {
        return `<span style="text-decoration: underline">${text}</span>`;
    });

module.exports = { serialize };
