const hr = require('./hr');
const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code');
const blockquote = require('./blockquote');
const unstyled = require('./unstyled');
const footnote = require('./footnote');
const table = require('./table');
const list = require('./list');
const definition = require('./definition');
const math = require('./math');
const comment = require('./comment');
const html = require('./html');
const custom = require('./custom');

module.exports = [
    // All link definition (for link reference) must be resolved first.
    definition,
    // HTML must be high in the stack too.
    html,
    table,
    hr,
    list,
    footnote,
    blockquote,
    codeBlock,
    heading,
    math,
    comment,
    custom,
    paragraph,
    unstyled
];
