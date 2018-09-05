#! /usr/bin/env node
/* eslint-disable no-console */

import { transform } from './helper';

import { State } from '../';
import markdown from '../markdown';

transform(document => {
    const state = State.create(markdown);
    const output = state.serializeDocument(document);

    console.log(output);
});
