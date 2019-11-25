/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { unendingTags } = require('./unendingTags');
const { HTMLParser, MarkdownParser, State } = require('../lib');

const PARSERS = {
    '.md': MarkdownParser,
    '.markdown': MarkdownParser,
    '.mdown': MarkdownParser,
    '.html': HTMLParser
};

/**
 * Fail with an error message
 * @param  {String} msg
 */
function fail(msg) {
    console.log('error:', msg);
    process.exit(1);
}

/**
 * Execute a transformation over file
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
function transform(fn) {
    if (process.argv.length < 3) {
        fail('no input file');
    }

    const filePath = path.join(process.cwd(), process.argv[2]);

    const ext = path.extname(filePath);
    const parser = PARSERS[ext];

    if (!parser) {
        fail('no parser for this file type');
    }

    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const state = State.create(parser, { unendingTags });

    const document = state.deserializeToDocument(content);

    fn(document, state);
}

module.exports = {
    transform
};
