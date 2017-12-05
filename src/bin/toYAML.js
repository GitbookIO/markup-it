#! /usr/bin/env node
/* eslint-disable no-console */

const yaml = require('js-yaml');
const { State } = require('slate');
const { transform } = require('./helper');

transform(document => {
    const state = State.create({ document });
    const raw = state.toJSON({ terse: true });

    console.log(yaml.safeDump(raw));
});
