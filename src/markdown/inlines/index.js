const text = require('./text');
const footnote = require('./footnote');
const image = require('./image');
const link = require('./link');
const html = require('./html');
const math = require('./math');
const variable = require('./variable');

const escape = require('./escape');
const code = require('./code');
const bold = require('./bold');
const italic = require('./italic');
const hardlineBreak = require('./hardline_break');
const strikethrough = require('./strikethrough');

module.exports = [
    footnote,
    image,
    link,
    math,
    html,
    variable,
    hardlineBreak,

    // Text ranegs should be escaped before processing marks
    escape,
    // Code mark should be applied before everything else
    code,
    // Bold should be before italic
    bold,
    italic,
    strikethrough,
    text
];
