#! /usr/bin/env node
/* eslint-disable no-console */

const { transform } = require('./helper');
const { State } = require('../');
const asciidoc = require('../asciidoc');

transform(document => {
    const state = State.create(asciidoc);
    const output = state.serializeDocument(document);

    console.log(output);
});
