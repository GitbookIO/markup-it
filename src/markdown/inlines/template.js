const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

/**
 * Serialize a template node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.TEMPLATE)
    .then((state) => {
        const node = state.peek();
        const { data } = node;

        const type = data.get('type');
        const text = data.get('text');

        let output;

        if (type == 'expr') output = `{% ${text} %}`;
        else if (type == 'comment') output = `{# ${text} #}`;
        else if (type == 'var') output = `{{ ${text} }}`;

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a template tag.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reInline.template, (state, match) => {
        if (state.getProp('template') === false) {
            return;
        }

        let type = match[1];
        const text = match[2];

        if (type == '%') type = 'expr';
        else if (type == '#') type = 'comment';
        else if (type == '{') type = 'var';

        const node = Inline.create({
            type: INLINES.TEMPLATE,
            isVoid: true,
            data: {
                type,
                text
            }
        });

        return state.push(node);
    });


module.exports = { serialize, deserialize };
