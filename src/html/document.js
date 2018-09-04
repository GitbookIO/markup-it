const { Serializer, Deserializer } = require('../');
const parse = require('./parse');

/**
 * Serialize a document to HTML.
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('document')
    .then(state => {
        const node = state.peek();
        const { nodes } = node;

        const text = state.use('block').serialize(nodes);

        return state.shift().write(text);
    });

/**
 * Deserialize an HTML document.
 * @type {Deserializer}
 */
const deserialize = Deserializer().then(state => {
    const { text } = state;
    const document = parse(text);

    return state.skip(text.length).push(document);
});

module.exports = { serialize, deserialize };
