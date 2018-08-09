const { Serializer, Deserializer, Mark, MARKS } = require('../../');
const reInline = require('../re/inline');
const utils = require('../utils');

/**
 * Serialize a underline text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.UNDERLINE, (state, text, mark) => {
        return utils.wrapInline(text, '__');
    });

/**
 * Deserialize a underline.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.strong, (state, match) => {
        const text = match[2] || match[1];
        const mark = Mark.create({ type: MARKS.UNDERLINE });

        const nodes = state
            .pushMark(mark)
            .deserialize(text);

        return state.push(nodes);
    });

module.exports = { serialize, deserialize };
