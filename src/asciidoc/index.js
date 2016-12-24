const deserialize = require('./deserialize');

const heading = require('./blocks/heading');
const paragraph = require('./blocks/paragraph');
const hr = require('./blocks/hr');
const code = require('./blocks/code');

const text = require('./inlines/text');
const bold = require('./inlines/bold');

module.exports = {
    block: [
        { deserialize },
        heading,
        paragraph,
        hr,
        code
    ],
    inline: [
        bold,
        text
    ]
};
