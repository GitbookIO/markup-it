#! /usr/bin/env node
/* eslint-disable no-console */
const yaml = require('js-yaml');
const { Value } = require('@gitbook/slate');
const { transform } = require('./helper');

transform(document => {
    const state = Value.create({ document });
    const raw = state.toJS();

    console.log(yaml.safeDump(raw));
});
