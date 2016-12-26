const deserialize = require('./deserialize');

const heading = require('./blocks/heading');
const paragraph = require('./blocks/paragraph');
const hr = require('./blocks/hr');
const codeBlock = require('./blocks/code');

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
        codeBlock
    ],
    inline: [
        bold,
        italic,
        code,
        text
    ]
};
