import htmlparser from 'htmlparser2';
import { List } from 'immutable';
import { Inline } from '@gitbook/slate';
import { BLOCKS, INLINES } from '../../constants';
import { Serializer, Deserializer, State } from '../../models';
import { HTMLParser } from '../../html';
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
 * Deserialize inline HTML
 * @param {String} html
 * @return {List<Node>} parsed nodes
 */
function deserializeHtml(html) {
    const htmlParser = State.create(HTMLParser);
    const document = htmlParser.deserializeToDocument(html);
    const firstNode = document.nodes.first();
    const isEmpty =
        !firstNode ||
        (document.nodes.size === 1 &&
            firstNode.type === BLOCKS.PARAGRAPH &&
            firstNode.nodes.every(child => !child.isVoid) &&
            firstNode.text === '');

    if (isEmpty) {
        return List();
    }

    return firstNode.nodes;
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

        // Finish parsing the inside of the HTML as Markdown
        const htmlNode = (() => {
            if (isHTMLBlock(tagName)) {
                // Do not parse inner HTML
                return createRawHTML({
                    openingTag,
                    closingTag,
                    innerHtml
                });
            }
            // else parse inner HTML as Markdown

            const isLink = tagName.toLowerCase() === 'a';
            const innerNodes = state
                .setProp(isLink ? 'link' : 'html', state.depth)
                .deserialize(innerHtml);

            return createHTML({
                openingTag,
                closingTag,
                nodes: innerNodes
            });
        })();

        // Now convert everything back to HTML and interpret the whole
        // (we got rid of any Markdown)
        const htmlParser = State.create(HTMLParser);
        const htmlOnly = htmlParser.use('block').serializeNode(htmlNode);

        return (
            state
                // If we have found an anchor, store it so it is attached to the next heading
                .setProp('lastAnchorId', findHtmlAnchor(htmlOnly))
                .push(deserializeHtml(htmlOnly))
        );
    }
);

/**
 * Look for <a id="..."></a>, often used to
 * add custom anchors to Markdown headings.
 * @param {String} html
 * @return {String | Null} id of the anchor found
 */
function findHtmlAnchor(html) {
    let anchorId = null;

    const parser = new htmlparser.Parser(
        {
            onopentag(tagName, attribs) {
                if (tagName.toLowerCase() === 'a' && attribs.id) {
                    // This is an anchor with an ID
                    anchorId = attribs.id;
                }
            }
        },
        { decodeEntities: true }
    );
    parser.write(html);
    parser.end();

    return anchorId;
}

/**
 * Deserialize HTML self closing tag from markdown
 * @type {Deserializer}
 */
const deserializeClosing = Deserializer().matchRegExp(
    reInline.htmlSelfClosingTag,
    (state, match) => {
        const [selfClosingHtml] = match;
        return state.push(deserializeHtml(selfClosingHtml));
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
