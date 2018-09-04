/* eslint-disable no-unexpected-multiline, no-spaced-func */
import { replace } from '../utils';

// quote related
const singleQuoted = /'(?:[^'\\]|\\.)*'/;
const doubleQuoted = /"(?:[^"\\]|\\.)*"/;
const quoted = replace(/singleQuoted|doubleQuoted/)(
    'singleQuoted',
    singleQuoted
)('doubleQuoted', doubleQuoted)();

// basic types
const integer = /-?\d+/;
const number = /-?\d+\.?\d*|\.?\d+/;
const bool = /true|false/;

// property access
const identifier = /[\w-]+/;
const literal = replace(/(?:quoted|bool|number)/)('quoted', quoted)(
    'bool',
    bool
)('number', number)();

// Match inner of the tag to split the name and the props
const tagLine = replace(/^\s*(identifier)\s*(.*)\s*$/)(
    'identifier',
    identifier
)();

// Types
const numberLine = replace(/^number$/)('number', number)();
const boolLine = replace(/^bool$/i)('bool', bool)();
const quotedLine = replace(/^quoted$/)('quoted', quoted)();

// Assignment of a variable message="Hello"
const assignment = replace(/(identifier)\s*=\s*(literal)/)(
    'identifier',
    identifier
)('literal', literal)();

// Argument or kwargs
const delimiter = /(?:\s*|^)/;
const prop = replace(/(?:delimiter)(?:(assignment|literal))/)(
    'literal',
    literal
)('delimiter', delimiter)('assignment', assignment)();

export default {
    prop,
    quoted,
    number,
    bool,
    literal,
    integer,
    identifier,
    quotedLine,
    numberLine,
    boolLine,
    tagLine
};
