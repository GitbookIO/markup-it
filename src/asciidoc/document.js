const { State, Serializer, Deserializer } = require('../');
const asciidoctor = require('asciidoctor.js')();
const html = require('../html');

/**
 * Render Asciidoc to HTML.
 * @param  {String} content
 * @return {String} html
 */
function asciidocToHTML(content) {
    return asciidoctor.convert(content, {
        'attributes': 'showtitle'
    });
}

/**
 * Serialize a document to Asciidoc.
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('document')
    .then((state) => {
        const node = state.peek();
        const { nodes } = node;

        const text = state
            .use('block')
            .serialize(nodes);

        return state
            .shift()
            .write(text);
    });

/**
 * Deserialize an Asciidoc document.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .then((state) => {
        const { text } = state;
        const htmlContent = asciidocToHTML(text);
        const htmlState = State.create(html);

        const document = htmlState.deserializeToDocument(htmlContent);

        return state
            .push(document)
            .skip(text.length);
    });

module.exports = { serialize, deserialize };
