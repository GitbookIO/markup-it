#! /usr/bin/env node
/* eslint-disable no-console */

import { Value } from 'slate';

import hyperprint from 'slate-hyperprint';
import { transform } from './helper';

transform(document => {
    const state = Value.create({ document });
    console.log(hyperprint(state));
});
