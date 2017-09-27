const { Serializer, Deserializer, Mark, Text, MARKS } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a code text to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .transformMarkedRange(MARKS.CODE, (state, text, mark) => {
        let separator = '`';

        // We need to find the right separator not present in the content
        while (text.indexOf(separator) >= 0) {
            separator += '`';
        }

        return (separator + text + separator);
    });

/**
 * Deserialize a code.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.code, (state, match) => {
        const text = match[2];
        const mark = Mark.create({ type: MARKS.CODE });

        const node = Text.create({ text, marks: [ mark ] });
        return state.push(node);
    });

module.exports = { serialize, deserialize };
