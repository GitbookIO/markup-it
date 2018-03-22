const { Serializer, MARKS } = require('../../');

/**
 * Serialize a italic text to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.ITALIC, (state, text, mark) => {
        return `<em>${text}</em>`;
    });

module.exports = { serialize };
