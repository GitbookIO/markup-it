/* eslint-disable no-unexpected-multiline, no-spaced-func */
import { replace } from '../utils';

import heading from './heading';
import table from './table';

const block = {
    newline: /^\n+/,
    code: /^((?: {4}|\t)[^\n]+\n*)+/,
    hr: /^( *[-*_]){3,} *(?:\n|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def|customBlock)[^\n]+)*\n*)+/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    // [someref]: google.com
    def: /^ {0,3}\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$)/,
    footnote: /^\[\^([^\]]+)\]: ([^\n]+)/,
    paragraph: /^((?:(?:(?!notParagraphPart)[^\n])+\n?(?!notParagraphNewline))+)\n*/,
    text: /^[^\n]+/,
    fences: /^ *(`{3,}|~{3,})[ .]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
    yamlHeader: /^ *(?=```)/,
    math: /^ *(\${2,}) *(\n+[\s\S]+?)\s*\1 *(?:\n|$)/,
    list: {
        block: /^( *)(bullet) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1allbull )\n*|\s*$|(?=\ncustomBlock))/,
        item: /^( *)(bullet) [^\n]*(?:\n(?!\1allbull )[^\n]*)*/,
        bullet: /(?:[*+-]|\d+\.)/,
        bullet_ul: /(?:\d+\.)/,
        bullet_ol: /(?:[*+-])/,
        checkbox: /^\[([ x])\] +/,
        bulletAndSpaces: /^ *([*+-]|\d+\.) +/
    },
    customBlock: /^{% *(.*?) *(?=[#%}]})%}/,
    comment: /^{#\s*(.*?)\s*(?=[#%}]})#}/
};

// Any string matching these inside a line will marks the end of the current paragraph
const notParagraphPart = 'customBlock';
// Any line starting with these marks the end of the previous paragraph.
const notParagraphNewline =
    'hr|heading|lheading|blockquote|tag|def|math|comment|customBlock|table|tablenp|fences|ol';

const _tag =
    '(?!(?:' +
    'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' +
    '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' +
    '|span|br|wbr|ins|del|img)\\b)\\w+(?!:\\/|[^\\w\\s@]*@)\\b';

block.list.item = replace(block.list.item, 'gm')(/allbull/g, block.list.bullet)(
    /bullet/g,
    block.list.bullet
)();

block.blockquote = replace(block.blockquote)('def', block.def)(
    'customBlock',
    block.customBlock
)();

block.list.block = replace(block.list.block)(/allbull/g, block.list.bullet)(
    'hr',
    '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))'
)('def', `\\n+(?=${block.def.source})`)('footnote', block.footnote)(
    'customBlock',
    block.customBlock
)();

block.list.block_ul = replace(block.list.block)(
    /bullet/g,
    block.list.bullet_ul
)();

block.list.block_ol = replace(block.list.block)(
    /bullet/g,
    block.list.bullet_ol
)();
block.list.block = replace(block.list.block)(/bullet/g, block.list.bullet)();

block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)(
    'closed',
    /<(tag)[^<]*?(?:>)[\s\S]+?<\/\1>/
)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">/])*?\/?>/)(/tag/g, _tag)();

block.paragraph = replace(block.paragraph)(
    'notParagraphPart',
    notParagraphPart
)('notParagraphNewline', notParagraphNewline)('hr', block.hr)(
    'heading',
    heading.normal
)('lheading', heading.line)('blockquote', block.blockquote)('tag', `<${_tag}`)(
    'def',
    block.def
)('math', block.math)('customBlock', block.customBlock)(
    'comment',
    block.comment
)('table', table.normal)('tablenp', table.nptable)(
    'fences',
    block.fences.source.replace('\\1', '\\2')
)('ol', block.list.block_ol.source.replace('\\1', '\\3'))();

export default block;
