// quote related
const singleQuoted = /'[^']*'/;
const doubleQuoted = /"[^"]*"/;
const quoted = new RegExp(`${singleQuoted.source}|${doubleQuoted.source}`);

// basic types
const integer = /-?\d+/;
const number = /-?\d+\.?\d*|\.?\d+/;
const bool = /true|false/;

// property access
const identifier = /[\w-]+/;
const literal = new RegExp(`(?:${quoted.source}|${bool.source}|${number.source})`);

// Match inner of the tag to split the name and the props
const tagLine = new RegExp(`^\\s*(${identifier.source})\\s*(.*)\\s*$`);

// Types
const numberLine = new RegExp(`^${number.source}$`);
const boolLine = new RegExp(`^${bool.source}$`, 'i');
const quotedLine = new RegExp(`^${quoted.source}$`);

// Assignment of a variable message="Hello"
const assignment = new RegExp(`(${identifier.source})\s*=\s*(${literal.source})`);

// Argument or kwargs
const delimiter = /(?:\s*|^)/;
const prop = new RegExp(`(?:${delimiter.source})(?:(${assignment.source}|${literal.source}))`);

module.exports = {
    prop,
    quoted, number, bool, literal, integer,
    identifier,
    quotedLine,
    numberLine,
    boolLine,
    tagLine
};
