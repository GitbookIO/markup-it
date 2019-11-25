import { MARKS } from '../../constants';
import { Serializer } from '../../models';

/**
 * Serialize an inline code to HTML
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.CODE,
    (state, text, mark) => `<code>${text}</code>`
);

export default { serialize };
