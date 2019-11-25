import { MARKS } from '../../constants';
import { Serializer } from '../../models';
import { escape } from '../utils';

/**
 * Escape all text leaves during serialization.
 * This step should be done before processing text leaves for marks.
 *
 * @type {Serializer}
 */
const serialize = Serializer().transformText((state, leaf) => {
    const { text, marks } = leaf;
    const hasCode = marks.some(mark => mark.type === MARKS.CODE);

    return leaf.merge({
        text: hasCode ? text : escape(text, false)
    });
});

export default { serialize };
