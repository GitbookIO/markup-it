const detectNewLine = require('detect-newline');
const htmlparser = require('htmlparser2');
const htmlclean = require('htmlclean');
const { List, Stack, Set } = require('immutable');
const { Document } = require('slate');
const { Deserializer } = require('../');
const {
    BLOCKS, INLINES, MARKS, CONTAINERS,
    Block, Inline, Text, Mark
} = require('../');

/**
 * Deserialize an HTML string
 * @type {Deserializer}
 */
const deserialize = Deserializer()
.then((state) => {
    const nodes = parse(state.text);
    return state
        .push(nodes)
        .skip(state.text.length);
});

const INLINE_TAGS = {
    a:              INLINES.LINK,
    img:            INLINES.IMAGE
};

const BLOCK_TAGS = {
    h1:             BLOCKS.HEADING_1,
    h2:             BLOCKS.HEADING_2,
    h3:             BLOCKS.HEADING_3,
    h4:             BLOCKS.HEADING_4,
    h5:             BLOCKS.HEADING_5,
    h6:             BLOCKS.HEADING_6,
    pre:            BLOCKS.CODE,
    blockquote:     BLOCKS.BLOCKQUOTE,
    p:              BLOCKS.PARAGRAPH,
    hr:             BLOCKS.HR,

    table:          BLOCKS.TABLE,
    tr:             BLOCKS.TABLE_ROW,
    td:             BLOCKS.TABLE_CELL,

    ul:             BLOCKS.UL_LIST,
    ol:             BLOCKS.OL_LIST,
    li:             BLOCKS.LIST_ITEM
};

const MARK_TAGS = {
    b:              MARKS.BOLD,
    del:            MARKS.STRIKETHROUGH,
    em:             MARKS.ITALIC,
    code:           MARKS.CODE
};

const VOID_TAGS = {
    hr: true,
    img: true
};

const TAGS_TO_DATA = {
    a(attribs) {
        return {
            href: attribs.href,
            title: attribs.alt || ''
        };
    },
    img(attribs) {
        return {
            src: attribs.src,
            title: attribs.alt || ''
        };
    },
    h1: resolveHeadingAttrs,
    h2: resolveHeadingAttrs,
    h3: resolveHeadingAttrs,
    h4: resolveHeadingAttrs,
    h5: resolveHeadingAttrs,
    h6: resolveHeadingAttrs
};

function resolveHeadingAttrs(attribs) {
    return attribs.id
        ? { id: attribs.id }
        : {};
}

/**
 * Parse an HTML string into a list of Nodes
 * @param {String} str
 * @return {List<Node>}
 */
function parse(str) {
    // Cleanup whitespaces
    str = htmlclean(str);

    // For convenience, starts with a root node
    const root = Document.create({
        type: BLOCKS.DOCUMENT
    });
    // The top of the stack always hold the current parent
    // node. Should never be empty.
    let stack = Stack().push(root);
    // The current marks
    let marks = Set();

    // Append a node child to the current parent node
    function appendNode(node) {
        const parent = stack.peek();
        const containerChildTypes = CONTAINERS[parent.type || parent.kind];

        // Wrap node if type is not allowed
        if (
            containerChildTypes
            && (node.kind !== 'block' || !containerChildTypes.includes(node.type))
        ) {
            node = Block.create({
                type: containerChildTypes[0],
                nodes: [node]
            });
        }

        const nodes = parent.nodes.push(node);
        stack = stack
            .pop()
            .push(parent.merge({ nodes }));
    }

    // Push a new node, as current parent. We started parsing it
    function pushNode(node) {
        stack = stack.push(node);
    }

    // Pop the current parent node. Because we're done parsing it
    function popNode() {
        const node = stack.peek();
        stack = stack.pop();
        appendNode(node);
    }

    const parser = new htmlparser.Parser({

        onopentag(tagName, attribs) {
            if (BLOCK_TAGS[tagName]) {
                const block = Block.create({
                    data: getData(tagName, attribs),
                    isVoid: isVoid(tagName),
                    type: BLOCK_TAGS[tagName]
                });

                pushNode(block);
            }

            else if (INLINE_TAGS[tagName]) {
                const inline = Inline.create({
                    data: getData(tagName, attribs),
                    isVoid: isVoid(tagName),
                    type: INLINE_TAGS[tagName]
                });

                pushNode(inline);
            }

            else if (MARK_TAGS[tagName]) {
                const mark = Mark.create({
                    data: getData(tagName, attribs),
                    type: MARK_TAGS[tagName]
                });

                marks = marks.add(mark);
            }

            else if (tagName == 'br') {
                const textNode = Text.createFromString('\n', marks);
                appendNode(textNode);
            }

            // else ignore
        },

        ontext(text) {
            const isEmptyText = !text.trim();
            if (isEmptyText) return;

            // Special rule for code blocks that we must split in lines
            if (stack.peek().type === BLOCKS.CODE) {
                splitLines(text).forEach(line => {
                    // Create a code line
                    pushNode(Block.create({ type: BLOCKS.CODE_LINE }));
                    // Push the text
                    appendNode(Text.createFromString(line));
                    popNode();
                });
            }

            // Usual behavior
            else {
                const textNode = Text.createFromString(text, marks);
                appendNode(textNode);
            }
        },

        onclosetag(tagName) {
            if (BLOCK_TAGS[tagName] || INLINE_TAGS[tagName]) {
                popNode();
            }

            else if (MARK_TAGS[tagName]) {
                const type = MARK_TAGS[tagName];
                marks = marks.filter(mark => mark.type !== type);
            }
            // else ignore
        }

    }, {
        decodeEntities: true
    });

    parser.write(str);
    parser.end();

    if (stack.size !== 1) {
        throw new Error('Invalid HTML. A tag might not have been closed correctly.');
    }

    const rootNodes = stack.peek().nodes;
    return List(rootNodes);
}

/**
 * @param {String} tagName The tag name
 * @param {Object} attrs The tag's attributes
 * @return {Object} data
 */
function getData(tagName, attrs) {
    return (
        TAGS_TO_DATA[tagName] || (() => {})
    )(attrs);
}

/**
 * @param {String} tagName The tag name
 * @return {Boolean} isVoid
 */
function isVoid(tagName) {
    return Boolean(VOID_TAGS[tagName]);
}


/**
 * Returns the list of lines in the string
 * @param {String} text
 * @param {String} sep?
 * @return {List<String>}
 */
function splitLines(text, sep) {
    sep = sep || detectNewLine(text) || '/n';
    return List(
        text.split(sep)
    );
}

module.exports = { deserialize };
