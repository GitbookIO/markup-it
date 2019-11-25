#! /usr/bin/env node
/* eslint-disable no-console */
const { transform } = require('./helper');
const { MarkdownParser, State } = require('../lib');

transform(document => {
    const state = State.create(MarkdownParser);
    const output = state.serializeDocument(document);

    console.log(output);
});
