const { Map } = require('immutable');
const entities = require('html-entities');
const { escapeWith, unescapeWith } = require('../utils/escape');

const htmlEntities = new entities.AllHtmlEntities();
const xmlEntities = new entities.XmlEntities();

// Replacements for Markdown escaping
// See http://spec.commonmark.org/0.15/#backslash-escapes
const REPLACEMENTS_ESCAPE = Map([
    [ '*', '\\*' ],
    [ '#', '\\#' ],
    // GitHub doesn't escape slashes, and render the backslash in that cause
    // [ '/', '\\/' ],
    [ '(', '\\(' ],
    [ ')', '\\)' ],
    [ '[', '\\[' ],
    [ ']', '\\]' ],
    [ '`', '\\`' ],
    [ '<', '&lt;' ],
    [ '>', '&gt;' ],
    [ '_', '\\_' ],
    [ '|', '\\|' ]
]);
// We do not escape all characters, but we want to unescape them all.
const REPLACEMENTS_UNESCAPE = REPLACEMENTS_ESCAPE.merge({
    ' ': '\\ ',
    '+': '\\+'
});

// Replacements for escaping urls (links and images)
const URL_REPLACEMENTS_UNESCAPE = REPLACEMENTS_UNESCAPE.merge({
    ' ': '%20'
});
const URL_REPLACEMENTS_ESCAPE = Map([
    [ '(', '%28' ],
    [ ')', '%29' ]
]);

/**
 * Escape markdown syntax
 * We escape only basic XML entities
 *
 * @param {String} str
 * @param {Boolean} escapeXML
 * @return {String}
 */
function escapeMarkdown(str, escapeXML) {
    str = escapeWith(REPLACEMENTS_ESCAPE, str);
    return escapeXML === false ? str : xmlEntities.encode(str);
}

/**
 * Unescape markdown syntax
 * We unescape all entities (HTML + XML)
 *
 * @param {String} str
 * @return {String}
 */
function unescapeMarkdown(str) {
    str = unescapeWith(REPLACEMENTS_UNESCAPE, str);
    return htmlEntities.decode(str);
}

/**
 * Escape an url
 *
 * @param {String} str
 * @return {String}
 */
function escapeURL(str) {
    return escapeWith(URL_REPLACEMENTS_ESCAPE, str);
}

/**
 * URI decode and unescape an url
 *
 * @param {String} str
 * @return {String}
 */
function unescapeURL(str) {
    let decoded;
    try {
        decoded = decodeURI(str);
    } catch (e) {
        if (!(e instanceof URIError)) {
            throw e;
        } else {
            decoded = str;
        }
    }

    return unescapeWith(URL_REPLACEMENTS_UNESCAPE, decoded);
}


/**
 * Create a function to replace content in a regex
 * @param  {RegEx} regex
 * @param  {String} opt
 * @return {Function(String, String)}
 */
function replace(regex, opt) {
    regex = regex.source;
    opt = opt || '';

    return function self(name, val) {
        if (!name) return new RegExp(regex, opt);
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return self;
    };
}

/**
 * Resolve a reference (links and images) in a state.
 * @param  {State} state
 * @param  {String} refID
 * @return {Object} props?
 */
function resolveRef(state, refID) {
    const refs = state.getProp('refs');

    refID = refID
        .replace(/\s+/g, ' ')
        .toLowerCase();

    const data = refs.get(refID);
    if (!data) {
        return;
    }

    return Map(data).filter(Boolean);
}

module.exports = {
    escape: escapeMarkdown,
    unescape: unescapeMarkdown,

    escapeURL,
    unescapeURL,

    replace,
    resolveRef
};
