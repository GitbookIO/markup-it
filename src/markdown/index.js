const block = require('./blocks');
const inline = require('./inlines');
const document = require('./document');

module.exports = {
    document: [document],
    inline,
    block
};
