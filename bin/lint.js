#! /usr/bin/env node
/* eslint-disable no-console */
const { transform } = require('./helper');

transform((document, state) => {
    const output = state.serializeDocument(document);
    console.log(output);
});
