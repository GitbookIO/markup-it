const table = require('./table');
const paragraph = require('./paragraph');
const hr = require('./hr');
const blockquote = require('./blockquote');
const code = require('./code');
const heading = require('./heading');
const list = require('./list');
const listitem = require('./listitem');
const unstyled = require('./unstyled');
const footnote = require('./footnote');
const html = require('./html');

module.exports = [
    paragraph,
    hr,
    blockquote,
    code,
    heading,
    list,
    listitem,
    unstyled,
    table.table,
    table.row,
    table.cell,
    footnote,
    html
];
