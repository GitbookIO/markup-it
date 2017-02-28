#! /usr/bin/env node
/* eslint-disable no-console */

const yaml = require('js-yaml');
const { Raw, State } = require('slate');
const { transform } = require('./helper');

transform(document => {
    const state = State.create({ document });
    const raw = Raw.serialize(state, { terse: true });

    console.log(yaml.safeDump(raw));
});
