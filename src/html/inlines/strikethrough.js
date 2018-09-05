import { Serializer, MARKS } from '../../';

/**
 * Serialize a strikethrough text to HTML
 * @type {Serializer}
 */
const serialize = Serializer().transformMarkedLeaf(
    MARKS.STRIKETHROUGH,
    (state, text, mark) => `<del>${text}</del>`
);

export default { serialize };
