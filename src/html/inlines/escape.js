import { Serializer } from '../../';
import escape from '../escape';

/**
 * Escape all text leaves during serialization.
 * This step should be done before processing text leaves for marks.
 *
 * @type {Serializer}
 */
const serialize = Serializer().transformText((state, leaf) => {
    const { text } = leaf;

    return leaf.merge({
        text: escape(text)
    });
});

export default { serialize };
