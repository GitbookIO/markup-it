const code = require('./code');
const bold = require('./bold');
const italic = require('./italic');
const strikethrough = require('./strikethrough');
const text = require('./text');
const image = require('./image');
const link = require('./link');
const footnoteRef = require('./footnote-ref');
const html = require('./html');

module.exports = [
    code,
    bold,
    italic,
    strikethrough,
    text,
    image,
    link,
    footnoteRef,
    html
];
