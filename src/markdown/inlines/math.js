const ltrim = require('ltrim');
const rtrim = require('rtrim');
const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Normalize some TeX content
 * @param {String} content
 * @return {String}
 */
function normalizeTeX(content) {
    content = ltrim(content, '\n');
    content = rtrim(content, '\n');

    return content;
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
            return;
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

module.exports = { serialize, deserialize };
