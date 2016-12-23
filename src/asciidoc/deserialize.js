const asciidoctor = require('asciidoctor.js')();
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
    const htmlState = State(html);

    const nodes = htmlState.deserialize(htmlContent);

    return state
        .push(nodes)
        .skip(state.text.length);
});

module.exports = deserialize;
