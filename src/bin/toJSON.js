#! /usr/bin/env node
/* eslint-disable no-console */

import { Value } from '@gitbook/slate';

import { transform } from './helper';

transform(document => {
    const state = Value.create({ document });
    const raw = state.toJSON();

    console.log(JSON.stringify(raw, null, 2));
});
