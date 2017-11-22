const { List } = require('immutable');
const { Serializer, Deserializer, Inline, INLINES } = require('../../');
const reInline = require('../re/inline');

// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks
// Treat these blocks as RAW HTML
const htmlBlocks = [
    'address', 'article', 'aside', 'base', 'basefont', 'blockquote', 'body', 'caption', 'center', 'col', 'colgroup',
    'dd', 'details', 'dialog', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
    'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'head', 'header', 'hr',
    'html', 'iframe', 'legend', 'li', 'link', 'main', 'menu', 'menuitem', 'meta', 'nav',
    'noframes', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'script', 'section',
    'source', 'title', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title',
    'tr', 'track', 'ul'
];

/**
 * Test if a tag name is a valid HTML block
 * @param {String} tag
 * @return {Boolean}
 */
function isHTMLBlock(tag) {
    tag = tag.toLowerCase();
    return htmlBlocks.indexOf(tag) >= 0;
}

/**
 * Create an HTML node
 * @param {String} raq
 * @return {Inline}
 */
function createHTML(html) {
    return Inline.create({
        type: INLINES.HTML,
        isVoid: true,
        data: { html }
    });
}

/**
 * Merge consecutive HTML nodes.
 * @param  {List<Node>} nodes
 * @return {List<Node>} nodes
 */
function mergeHTMLNodes(nodes) {
    const result = nodes.reduce(
        (accu, node) => {
            let last = accu.length > 0 ? accu[accu.length - 1] : null;

            if (last && node.type == INLINES.HTML && last.type == node.type) {
                last = last.merge({
                    data: last.data.set(
                        'html',
                        last.data.get('html') + node.data.get('html')
                    )
                });

                accu.shift();
                accu.push(last);

                return accu;
            }

            return accu.concat([ node ]);
        },
        []
    );

    return List(result);
}

/**
 * Serialize an HTML node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.HTML)
    .then(state => {
        const node = state.peek();
        return state
            .shift()
            .write(node.data.get('html'));
    });

/**
 * Deserialize HTML comment from markdown
 * @type {Deserializer}
 */
const deserializeComment = Deserializer()
.matchRegExp(reInline.htmlComment, (state, match) => {
    // Ignore
    return state;
});

/**
 * Deserialize HTML comment from markdown
 * @type {Deserializer}
 */
const deserializePair = Deserializer()
.matchRegExp(
    reInline.htmlTagPair, (state, match) => {
        const [ fullTag, tagName, attributes, innerText ] = match;
        let innerNodes = [];

        const startTag = `<${tagName}${attributes}>`;
        const endTag = fullTag.slice(startTag.length + innerText.length);
        console.log('');
        console.log('startTag', startTag);
        console.log('innertText', innerText);
        console.log('endTag', endTag);
        if (innerText) {
            if (isHTMLBlock(tagName)) {
                innerNodes = [createHTML(innerText)];
            } else {
                const isLink = (tagName.toLowerCase() === 'a');

                innerNodes = state
                    .setProp(isLink ? 'link' : 'html', state.depth)
                    .deserialize(innerText);
            }
        }

        let nodes = List([ createHTML(startTag) ])
            .concat(innerNodes)
            .push(createHTML(endTag));

        nodes = mergeHTMLNodes(nodes);

        return state.push(nodes);
    }
);


/**
 * Deserialize HTML comment from markdown
 * @type {Deserializer}
 */
const deserializeClosing = Deserializer()
.matchRegExp(
    reInline.htmlSelfClosingTag, (state, match) => {
        const [ tag ] = match;
        return state.push(List([ createHTML(tag) ]));
    }
);

module.exports = {
    serialize,
    deserialize: Deserializer().use([
        deserializeComment,
        deserializePair,
        deserializeClosing
    ])
};
