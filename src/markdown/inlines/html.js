import { Serializer, Deserializer, Inline, INLINES } from '../../';
import reInline from '../re/inline';
import HTML_BLOCKS from './HTML_BLOCKS';

/**
 * Test if a tag name is an HTML block that should not be parsed inside
 * @param {String} tag
 * @return {Boolean}
 */
function isHTMLBlock(tag) {
    return HTML_BLOCKS.indexOf(tag.toLowerCase()) >= 0;
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
        const {
            openingTag = '',
            closingTag = '',
            innerHtml = ''
        } = node.data.toObject();
        if (innerHtml) {
            return state
                .shift()
                .write(openingTag)
                .write(innerHtml)
                .write(closingTag);
        }
        return state
            .shift()
            .write(openingTag)
            .write(state.serialize(node.nodes))
            .write(closingTag);
    });

/**
 * Deserialize HTML comment from markdown
 * @type {Deserializer}
 */
const deserializeComment = Deserializer().matchRegExp(
    reInline.htmlComment,
    (state, match) =>
        // Ignore
        state
);

/**
 * Deserialize HTML tag pair from markdown
 * @type {Deserializer}
 */
const deserializePair = Deserializer().matchRegExp(
    reInline.htmlTagPair,
    (state, match) => {
        const [fullTag, tagName, attributes = '', innerHtml = ''] = match;

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
        }
        // Parse inner HTML
        const isLink = tagName.toLowerCase() === 'a';

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
);

/**
 * Deserialize HTML self closing tag from markdown
 * @type {Deserializer}
 */
const deserializeClosing = Deserializer().matchRegExp(
    reInline.htmlSelfClosingTag,
    (state, match) => {
        const [openingTag] = match;
        return state.push(createRawHTML({ openingTag }));
    }
);

export default {
    serialize,
    deserialize: Deserializer().use([
        deserializeComment,
        deserializePair,
        deserializeClosing
    ])
};
