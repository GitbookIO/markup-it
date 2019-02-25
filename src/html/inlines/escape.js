import { Serializer } from '../../';
import escape from '../escape';

/**
 * Escape all text leaves during serialization.
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
