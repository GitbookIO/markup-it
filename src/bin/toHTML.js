#! /usr/bin/env node
/* eslint-disable no-console */

import { transform } from './helper';

import { State } from '../';
import html from '../html';

transform(document => {
    const state = State.create(html);
    const output = state.serializeDocument(document);

    console.log(output);
});
