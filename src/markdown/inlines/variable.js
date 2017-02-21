const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a template variable to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.TEMPLATE_VARIABLE)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        const key = data.get('key');

        return state
            .shift()
            .write(`{{ ${key} }}`);
    });

/**
 * Deserialize a template variable.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.variable, (state, match) => {
        if (state.getProp('template') === false) {
            return;
        }

        const node = Inline.create({
            type: INLINES.TEMPLATE_VARIABLE,
            isVoid: true,
            data: {
                key: match[1]
            }
        });

        return state.push(node);
    });


module.exports = { serialize, deserialize };
