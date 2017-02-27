const { Map } = require('immutable');
const lexical = require('./lexical');
const { unescape } = require('./escape');

/**
 * Parse a literal value.
 * @param  {String} str
 * @return {String|Number|Boolean}
 */
function parseLiteral(str) {
    if (str.match(lexical.numberLine)) {
        return Number(str);
    }
    else if (str.match(lexical.boolLine)) {
        return str.toLowerCase() === 'true';
    }
    else if (str.match(lexical.quotedLine)) {
        return unescape(str.slice(1, -1));
    }

    return str;
}

/**
 * Parse props.
 * @param  {String} text
 * @return {Map} props
 */
function parseProps(text) {
    let match, args = 0;
    const result = {};

    do {
        match = text.match(lexical.prop);

        if (match) {
            if (match[2]) {
                result[match[2]] = parseLiteral(match[3]);
            } else {
                result[args] = parseLiteral(match[1]);
                args++;
            }

            text = text.slice(match[0].length);
        }
    } while (match);

    return Map(result);
}

/**
 * Parse the inner text of a tag.
 * @param  {String} text
 * @return {Object} { tag: String, props: Map }
 */
function parseTag(text) {
    const match = text.match(lexical.tagLine);

    return {
        tag: match[1],
        props: parseProps(match[2])
    };
}

module.exports = parseTag;
