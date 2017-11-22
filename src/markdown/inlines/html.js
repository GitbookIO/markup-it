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
 * Test if a tag name is an HTML block that should not be parsed inside
 * @param {String} tag
 * @return {Boolean}
 */
function isHTMLBlock(tag) {
    tag = tag.toLowerCase();
    return htmlBlocks.indexOf(tag) >= 0;
}

/**
 * Create a raw HTML node (inner Html not parsed)
 * @param {String} openingTag
 * @param {String} closingTag
 * @param {String} innerHtml
 * @param
 * @return {Inline}
 */
function createRawHTML(opts) {
    const { openingTag = '', closingTag = '', innerHtml = '' } = opts;
    return Inline.create({
        type: INLINES.HTML,
        isVoid: true,
        data: { openingTag, closingTag, innerHtml }
    });
}

/**
 * Create an HTML node
 * @param {String} openingTag
 * @param {String} closingTag
 * @param {Node[]} nodes
 * @return {Inline}
 */
function createHTML(opts) {
    const { openingTag = '', closingTag = '', nodes } = opts;
    return Inline.create({
        type: INLINES.HTML,
        data: { openingTag, closingTag },
        nodes
    });
}

/**
 * Serialize an HTML node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.HTML)
    .then(state => {
        const node = state.peek();
        const { openingTag = '', closingTag = '', innerHtml = '' } = node.data.toObject();
        if (innerHtml) {
            return state
                .shift()
                .write(openingTag)
                .write(innerHtml)
                .write(closingTag);
        } else {
            return state
                .shift()
                .write(openingTag)
                .write(
                    state.serialize(node.nodes)
                )
                .write(closingTag);
        }
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
        const [ fullTag, tagName, attributes, innerHtml ] = match;

        const openingTag = `<${tagName}${attributes}>`;
        const closingTag = fullTag.slice(openingTag.length + innerHtml.length);

        if (isHTMLBlock(tagName)) {
            // Do not parse inner HTML
            return state.push(
                createRawHTML({
                    openingTag,
                    closingTag,
                    innerHtml
                })
            );
        } else {
            // Parse inner HTML
            const isLink = (tagName.toLowerCase() === 'a');

            const innerNodes = state
                .setProp(isLink ? 'link' : 'html', state.depth)
                .deserialize(innerHtml);

            return state.push(
                createHTML({
                    openingTag,
                    closingTag,
                    nodes: innerNodes
                })
            );
        }
    }
);

/**
 * Deserialize HTML comment from markdown
 * @type {Deserializer}
 */
const deserializeClosing = Deserializer()
.matchRegExp(
    reInline.htmlSelfClosingTag, (state, match) => {
        const [ openingTag ] = match;
        return state.push(createRawHTML({ openingTag }));
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
