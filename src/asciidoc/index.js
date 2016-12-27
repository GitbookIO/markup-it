const deserialize = require('./deserialize');

const heading = require('./blocks/heading');
const paragraph = require('./blocks/paragraph');
const hr = require('./blocks/hr');
const codeBlock = require('./blocks/code');
const blockquote = require('./blocks/blockquote');

const link = require('./inlines/link');
const image = require('./inlines/image');
const text = require('./inlines/text');
const bold = require('./inlines/bold');
const italic = require('./inlines/italic');
const code = require('./inlines/code');

module.exports = {
    block: [
        { deserialize },
        heading,
        paragraph,
        hr,
        codeBlock,
        blockquote
    ],
    inline: [
        link,
        image,
        bold,
        italic,
        code,
        text
    ]
};
