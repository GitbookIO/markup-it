const ltrim = require('ltrim');
const rtrim = require('rtrim');
const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Return true if a tex content is inline
 */
function isInlineTex(content) {
    return content[0] !== '\n';
}

/**
 * Normalize some TeX content
 * @param {String} content
 * @param {Boolean} isInline
 * @return {String}
 */
function normalizeTeX(content, isInline) {
    content = ltrim(content, '\n');
    content = rtrim(content, '\n');

    if (!isInline) {
        content = '\n' + content + '\n';
    }

    return content;
}

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.MATH)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        let tex = data.get('tex');
        const isInline = isInlineTex(tex);

        tex = normalizeTeX(tex, isInline);

        let output = '$$' + tex + '$$';

        if (!isInline) {
            output = '\n' + output + '\n';
        }

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a math
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.math, (state, match) => {
        const tex = match[1];

        if (state.getProp('math') === false || tex.trim().length === 0) {
            return;
        }

        const node = Inline.create({
            type: INLINES.MATH,
            isVoid: true,
            data: {
                tex
            }
        });

        return state.push(node);
    });


module.exports = { serialize, deserialize };
