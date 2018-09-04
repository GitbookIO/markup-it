/* eslint-disable no-console */
import fs from 'fs';

import path from 'path';
import unendingTags from '../../test/unendingTags';
import { State } from '../';
import markdown from '../markdown';
import html from '../html';

const PARSERS = {
    '.md': markdown,
    '.markdown': markdown,
    '.mdown': markdown,
    '.html': html
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

export default {
    transform
};
