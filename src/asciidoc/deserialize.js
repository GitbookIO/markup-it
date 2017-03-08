const asciidoctor = require('asciidoctor.js')();
const Slate = require('slate');
const { State, Deserializer } = require('../');
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
 * Deserialize an Asciidoc string
 * @type {Deserializer}
 */
const deserialize = Deserializer()
.then((state) => {
    const htmlContent = asciidocToHTML(state.text);
    const htmlState = State.create(html);

    const nodes = htmlState.deserialize(htmlContent);

    // Normalize the document, since for now HTML introduces a lot of
    // unwanted empty text nodes.
    const normalizedNodes = Slate
              .State.create({
                  document: Slate.Document.create({ nodes })
              }, { normalize: true })
              .document.nodes;

    return state
        .push(normalizedNodes)
        .skip(state.text.length);
});

module.exports = deserialize;
