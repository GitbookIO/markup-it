import { Serializer, Deserializer } from '../../models';
import reInline from '../re/inline';
import * as utils from '../utils';

/**
 * Serialize a text node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('text')
    .then(state => {
        const node = state.peek();

        return state.shift().write(node.text);
    });

/**
 * Deserialize escaped text.
 * @type {Deserializer}
 */
const deserializeEscaped = Deserializer().matchRegExp(
    reInline.escape,
    (state, match) => state.pushText(match[1])
);

/**
 * Deserialize text.
 * @type {Deserializer}
 */
const deserializeText = Deserializer().matchRegExp(
    reInline.text,
    (state, match) => {
        const text = utils.unescape(match[0]);
        return state.pushText(text);
    }
);

const deserialize = Deserializer().use([deserializeEscaped, deserializeText]);

export default { serialize, deserialize };
