import { Serializer, MARKS } from '../../';

/**
 * Serialize a italic text to HTML
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.ITALIC,
    (state, text, mark) => `<em>${text}</em>`
);

export default { serialize };
