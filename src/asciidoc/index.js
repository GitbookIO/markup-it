const document = require('./document');

const heading = require('./blocks/heading');
const paragraph = require('./blocks/paragraph');
const unstyled = require('./blocks/unstyled');
const hr = require('./blocks/hr');
const codeBlock = require('./blocks/code');
const blockquote = require('./blocks/blockquote');
const list = require('./blocks/list');
const table = require('./blocks/table');
const footnotes = require('./blocks/footnotes');

const link = require('./inlines/link');
const image = require('./inlines/image');
const text = require('./inlines/text');
const escape = require('./inlines/escape');
const bold = require('./inlines/bold');
const italic = require('./inlines/italic');
const footnoteRef = require('./inlines/footnote');
const strikethrough = require('./inlines/strikethrough');
const code = require('./inlines/code');

module.exports = {
    document: [
        document
    ],
    block: [
        footnotes,
        heading,
        paragraph,
        hr,
        codeBlock,
        blockquote,
        unstyled,
        list,
        table
    ],
    inline: [
        link,
        image,
        escape,
        bold,
        italic,
        code,
        strikethrough,
        footnoteRef,
        text
    ]
};
