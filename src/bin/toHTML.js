#! /usr/bin/env node
/* eslint-disable no-console */

const { transform } = require('./helper');
const { State } = require('../');
const html = require('../html');

transform(document => {
    const state = State.create(html);
    const output = state.serializeDocument(document);

    console.log(output);
});
