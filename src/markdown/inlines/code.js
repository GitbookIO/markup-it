import { Serializer, Deserializer, Mark, Text, MARKS } from '../../';
import reInline from '../re/inline';
import { wrapInline } from '../utils';

/**
 * Serialize a code text to markdown
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.CODE,
    (state, text, mark) => {
        let separator = '`';

        // We need to find the right separator not present in the content
        while (text.indexOf(separator) >= 0) {
            separator += '`';
        }

        return wrapInline(text, separator);
    }
);

/**
 * Deserialize a code.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reInline.code,
    (state, match) => {
        const text = match[2];
        const mark = Mark.create({ type: MARKS.CODE });

        const node = Text.create({ text, marks: [mark, ...state.marks] });
        return state.push(node);
    }
);

export default { serialize, deserialize };
