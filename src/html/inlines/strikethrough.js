const { Serializer, MARKS } = require('../../');

/**
 * Serialize a strikethrough text to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.STRIKETHROUGH, (state, text, mark) => {
        return `<del>${text}</del>`;
    });

module.exports = { serialize };
