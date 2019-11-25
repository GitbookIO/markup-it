import { Map } from 'immutable';
import lexical from './lexical';
import { unescape } from './escape';

/**
 * Parse a literal value.
 * @param  {String} str
 * @return {String|Number|Boolean}
 */
function parseLiteral(str) {
    if (str.match(lexical.numberLine)) {
        return Number(str);
    } else if (str.match(lexical.boolLine)) {
        return str.toLowerCase() === 'true';
    } else if (str.match(lexical.quotedLine)) {
        return unescape(str.slice(1, -1));
    }

    return str;
}

/**
 * Parse data of the block.
 * @param  {String} text
 * @return {Map} props
 */
function parseData(inputText) {
    let match;
    let args = 0;
    const result = {};

    let text = inputText;
    do {
        match = text.match(lexical.prop);

        if (match) {
            if (match[2]) {
                result[match[2]] = parseLiteral(match[3]);
            } else {
                result[args] = parseLiteral(match[1]);
                args += 1;
            }

            text = text.slice(match[0].length);
        }
    } while (match);

    return Map(result);
}

/**
 * Parse the inner text of a tag.
 * @param  {String} text
 * @return {Object | Null} { tag: String, data: Map }
 */
export function parseTag(text) {
    const match = text.match(lexical.tagLine);

    if (!match) {
        return null;
    }

    return {
        tag: match[1],
        data: parseData(match[2])
    };
}
