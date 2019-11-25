import { MARKS } from '../../constants';
import { Serializer } from '../../models';

/**
 * Serialize a bold text to HTML
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.BOLD,
    (state, text, mark) => `<b>${text}</b>`
);

export default { serialize };
