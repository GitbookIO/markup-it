const deserialize = require('./deserialize');
const heading = require('./blocks/heading');
const text = require('./inlines/text');

module.exports = {
    block: [
        { deserialize },
        heading
    ],
    inline: [
        text
    ]
};
