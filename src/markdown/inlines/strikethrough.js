const { Serializer, Deserializer, Mark, MARKS } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a strikethrough text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedLeaf(MARKS.STRIKETHROUGH, (state, text) => {
        return `~~${text}~~`;
    });

/**
 * Deserialize a strikethrough.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.del, (state, match) => {
        const text = match[1];
        const mark = Mark.create({ type: MARKS.STRIKETHROUGH });

        const nodes = state
            .pushMark(mark)
            .deserialize(text);

        return state.push(nodes);
    });

module.exports = { serialize, deserialize };
