import { Serializer, Deserializer, Inline, INLINES } from '../../';
import reInline from '../re/inline';

/**
 * Serialize a footnote to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.FOOTNOTE_REF)
    .then(state => {
        const node = state.peek();
        const id = node.data.get('id');
        const output = `[^${id}]`;

        return state.shift().write(output);
    });

/**
 * Deserialize a footnote.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reInline.reffn,
    (state, match) => {
        const id = match[1];
        const node = Inline.create({
            type: INLINES.FOOTNOTE_REF,
            isVoid: true,
            data: {
                id
            }
        });

        return state.push(node);
    }
);

export default { serialize, deserialize };
