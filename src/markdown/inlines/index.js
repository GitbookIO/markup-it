import text from './text';
import footnote from './footnote';
import image from './image';
import link from './link';
import html from './html';
import math from './math';
import variable from './variable';
import escape from './escape';
import code from './code';
import bold from './bold';
import italic from './italic';
import hardlineBreak from './hardline_break';
import strikethrough from './strikethrough';

export default [
    footnote,
    image,
    link,
    math,
    html,
    variable,
    hardlineBreak,

    // Text ranegs should be escaped before processing marks
    escape,
    // Code mark should be applied before everything else
    code,
    // Bold should be before italic
    bold,
    italic,
    strikethrough,
    text
];
