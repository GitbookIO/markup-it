import hr from './hr';
import heading from './heading';
import paragraph from './paragraph';
import codeBlock from './code';
import blockquote from './blockquote';
import unstyled from './unstyled';
import footnote from './footnote';
import table from './table';
import list from './list';
import definition from './definition';
import math from './math';
import comment from './comment';
import html from './html';
import custom from './custom';

export default [
    // All link definition (for link reference) must be resolved first.
    definition,
    // HTML must be high in the stack too.
    html,
    table,
    hr,
    list,
    footnote,
    blockquote,
    codeBlock,
    heading,
    math,
    comment,
    custom,
    paragraph,
    unstyled
];
