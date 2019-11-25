import { Mark } from '@gitbook/slate';
import { MARKS } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import reInline from '../re/inline';
import { wrapInline } from '../utils';

/**
 * Serialize a italic text to markdown
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.ITALIC,
    (state, text) => wrapInline(text, '_')
);

/**
 * Deserialize an italic.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reInline.em, (state, match) => {
    const text = match[2] || match[1];
    const mark = Mark.create({ type: MARKS.ITALIC });

    const nodes = state.pushMark(mark).deserialize(text);

    return state.push(nodes);
});

export default { serialize, deserialize };
