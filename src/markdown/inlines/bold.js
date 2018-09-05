import { Serializer, Deserializer, Mark, MARKS } from '../../';
import reInline from '../re/inline';
import { wrapInline } from '../utils';

/**
 * Serialize a bold text to markdown
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.BOLD,
    (state, text, mark) => wrapInline(text, '**')
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

export default { serialize, deserialize };
