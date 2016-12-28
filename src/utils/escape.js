const escapeStringRegexp = require('escape-string-regexp');

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
function escapeWith(replacements, text) {
    text = replacements.reduce(
        (out, value, key) => {
            return out.replace(re(key), value);
        },
        text
    );

    return text;
}

/**
 * Unescape a string using a map of replacements.
 * @param  {Map} replacements
 * @param  {String} text
 * @return {String}
 */
function unescapeWith(replacements, text) {
    return escapeWith(replacements.flip(), text);
}

module.exports = {
    escapeWith,
    unescapeWith
};
