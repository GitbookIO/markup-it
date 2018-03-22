const { Serializer, Deserializer, Mark, MARKS } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a italic text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.ITALIC, (state, text) => {
        return `_${text}_`;
    });

/**
 * Deserialize an italic.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.em, (state, match) => {
        const text = match[2] || match[1];
        const mark = Mark.create({ type: MARKS.ITALIC });

        const nodes = state
            .pushMark(mark)
            .deserialize(text);

        return state.push(nodes);
    });

module.exports = { serialize, deserialize };
