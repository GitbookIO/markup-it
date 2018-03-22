const { Serializer, Deserializer } = require('../../');
const reInline = require('../re/inline');
const utils = require('../utils');

/**
 * Serialize a text node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('text')
    .then(state => {
        const node = state.peek();

        return state
            .shift()
            .write(node.text);
    });

/**
 * Deserialize escaped text.
 * @type {Deserializer}
 */
const deserializeEscaped = Deserializer()
    .matchRegExp(reInline.escape, (state, match) => {
        return state.pushText(match[1]);
    });

/**
 * Deserialize text.
 * @type {Deserializer}
 */
const deserializeText = Deserializer()
    .matchRegExp(reInline.text, (state, match) => {
        const text = utils.unescape(match[0]);
        return state.pushText(text);
    });

const deserialize = Deserializer()
    .use([
        deserializeEscaped,
        deserializeText
    ]);

module.exports = { serialize, deserialize };
