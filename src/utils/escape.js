import escapeStringRegexp from 'escape-string-regexp';

// Build a regexp from a string
function re(str) {
    return new RegExp(escapeStringRegexp(str), 'g');
}

/**
 * Escape a string using a map of replacements.
 * @param  {Map} replacements
 * @param  {String} text
 * @return {String}
 */
export function escapeWith(replacements, text) {
    return replacements.reduce(
        (out, value, key) => out.replace(re(key), value),
        text
    );
}

/**
 * Unescape a string using a map of replacements.
 * @param  {Map} replacements
 * @param  {String} text
 * @return {String}
 */
export function unescapeWith(replacements, text) {
    return escapeWith(replacements.flip(), text);
}
