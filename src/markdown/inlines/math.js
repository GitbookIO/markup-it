import ltrim from 'ltrim';
import rtrim from 'rtrim';
import { Inline } from '@gitbook/slate';
import { INLINES } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import reInline from '../re/inline';

/**
 * Normalize some TeX content
 * @param {String} content
 * @return {String}
 */
function normalizeTeX(content) {
    return rtrim(ltrim(content, '\n'), '\n');
}

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.MATH)
    .then(state => {
        const node = state.peek();
        const { data } = node;
        let formula = data.get('formula');

        formula = normalizeTeX(formula);

        const output = `$$${formula}$$`;

        return state.shift().write(output);
    });

/**
 * Deserialize a math
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reInline.math,
    (state, match) => {
        const formula = match[1].trim();

        if (state.getProp('math') === false || !formula) {
            return undefined;
        }

        const node = Inline.create({
            type: INLINES.MATH,
            isVoid: true,
            data: {
                formula
            }
        });

        return state.push(node);
    }
);

export default { serialize, deserialize };
