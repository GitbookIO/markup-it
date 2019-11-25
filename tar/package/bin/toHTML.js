#! /usr/bin/env node
/* eslint-disable no-console */
const { transform } = require('./helper');
const { HTMLParser, State } = require('../lib');

transform(document => {
    const state = State.create(HTMLParser);
    const output = state.serializeDocument(document);

    console.log(output);
});
