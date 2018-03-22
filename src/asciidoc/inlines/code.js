const { Serializer, MARKS } = require('../../');

/**
 * Serialize an inline code to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.CODE, (state, text, mark) => {
        return '``' + text + '``';
    });

module.exports = { serialize };
