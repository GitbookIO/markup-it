import { Serializer, MARKS } from '../../';
import escape from '../escape';

/**
 * Serialize an inline code to HTML
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.CODE,
    (state, text, mark) => `<code>${escape(text)}</code>`
);

export default { serialize };
