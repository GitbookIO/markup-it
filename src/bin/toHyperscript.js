#! /usr/bin/env node
/* eslint-disable no-console */

import { Value } from '@gitbook/slate';

import hyperprint from '@gitbook/slate-hyperprint';
import { transform } from './helper';

transform(document => {
    const state = Value.create({ document });
    console.log(hyperprint(state));
});
