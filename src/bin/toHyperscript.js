#! /usr/bin/env node
/* eslint-disable no-console */

const { State } = require('slate');
const hyperprint = require('slate-hyperprint').default;
const { transform } = require('./helper');

transform(document => {
    const state = State.create({ document });
    console.log(hyperprint(state));
});
