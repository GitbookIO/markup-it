#! /usr/bin/env node
/* eslint-disable no-console */

const { Raw, State } = require('slate');
const { transform } = require('./helper');

transform(document => {
    const state = State.create({ document });
    const raw = Raw.serialize(state, { terse: true });

    console.log(JSON.stringify(raw, null, 2));
});
