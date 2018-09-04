#! /usr/bin/env node
/* eslint-disable no-console */

import yaml from 'js-yaml';

import { Value } from 'slate';
import { transform } from './helper';

transform(document => {
    const state = Value.create({ document });
    const raw = state.toJSON();

    console.log(yaml.safeDump(raw));
});
