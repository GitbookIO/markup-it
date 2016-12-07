const { Serializer, MARKS } = require('../../');
const utils = require('../utils');

/**
 * Escape all text ranges during serialization.
 * This step should be done before processing text ranges for marks.
 *
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformText((state, range) => {
        const { text, marks } = range;
        const hasCode = marks.some(mark => mark.type === MARKS.CODE);

        return range.merge({
            text: hasCode ? text : utils.escape(text, false)
        });
    });

module.exports = { serialize };
