/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const { State } = require('../src/');
const markdown = require('../src/markdown');
const html = require('../src/html');
const asciidoc = require('../src/asciidoc');

const PARSERS = {
    '.md':       markdown,
    '.markdown': markdown,
    '.mdown':    markdown,
    '.html':     html,
    '.adoc':     asciidoc,
    '.asciidoc': asciidoc
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
    const state = State.create(parser);

    const document = state.deserializeToDocument(content);

    fn(document, state);
}

module.exports = {
    transform
};
