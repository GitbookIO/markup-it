#! /usr/bin/env node
/* eslint-disable no-console */

const { State } = require('slate');
const { transform } = require('./helper');

transform(document => {
    const state = State.create({ document });
    const raw = state.toJSON();

    console.log(JSON.stringify(raw, null, 2));
});
