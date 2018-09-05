#! /usr/bin/env node
/* eslint-disable no-console */

import { transform } from './helper';

transform((document, state) => {
    const output = state.serializeDocument(document);
    console.log(output);
});
