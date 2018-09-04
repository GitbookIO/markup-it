import { Serializer, Deserializer, Inline, INLINES } from '../../';
import reInline from '../re/inline';

/**
 * Serialize a template variable to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.VARIABLE)
    .then(state => {
        const node = state.peek();
        const { data } = node;
        const key = data.get('key');

        return state.shift().write(`{{ ${key} }}`);
    });

/**
 * Deserialize a template variable.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reInline.variable,
    (state, match) => {
        if (state.getProp('template') === false) {
            return undefined;
        }

        const node = Inline.create({
            type: INLINES.VARIABLE,
            isVoid: true,
            data: {
                key: match[1]
            }
        });

        return state.push(node);
    }
);

export default { serialize, deserialize };
