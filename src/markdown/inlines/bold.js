const { Serializer, Deserializer, Mark, MARKS } = require('../../');
const reInline = require('../re/inline');
const utils = require('../utils');

/**
 * Serialize a bold text to markdown
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.BOLD,
    (state, text, mark) => utils.wrapInline(text, '**')
);

/**
 * Deserialize a bold.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reInline.strong,
    (state, match) => {
        const text = match[2] || match[1];
        const mark = Mark.create({ type: MARKS.BOLD });

        const nodes = state.pushMark(mark).deserialize(text);

        return state.push(nodes);
    }
);

module.exports = { serialize, deserialize };
