const { Serializer, MARKS } = require('../../');

/**
 * Serialize an inline code to Asciidoc
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedRange(MARKS.CODE, (state, text, mark) => {
        return '``' + text + '``';
    });

module.exports = { serialize };
