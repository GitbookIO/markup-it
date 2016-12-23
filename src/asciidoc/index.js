const deserialize = require('./deserialize');
const heading = require('./blocks/heading');
const paragraph = require('./blocks/paragraph');
const hr = require('./blocks/hr');
const text = require('./inlines/text');

module.exports = {
    block: [
        { deserialize },
        heading,
        paragraph,
        hr
    ],
    inline: [
        text
    ]
};
