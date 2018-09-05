import { Map } from 'immutable';
import entities from 'entities';
import { escapeWith, unescapeWith } from '../utils/escape';

// Replacements for Markdown escaping
// See http://spec.commonmark.org/0.15/#backslash-escapes
const REPLACEMENTS_ESCAPE = Map([
    ['*', '\\*'],
    ['#', '\\#'],
    // GitHub doesn't escape slashes, and render the backslash in that cause
    // [ '/', '\\/' ],
    ['(', '\\('],
    [')', '\\)'],
    ['[', '\\['],
    [']', '\\]'],
    ['`', '\\`'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['_', '\\_'],
    ['|', '\\|']
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
const URL_REPLACEMENTS_ESCAPE = Map([[' ', '%20'], ['(', '%28'], [')', '%29']]);

/**
 * Escape markdown syntax
 * We escape only basic XML entities
 *
 * @param {String} str
 * @param {Boolean} escapeXML
 * @return {String}
 */
function escape(inputStr, escapeXML) {
    const str = escapeWith(REPLACEMENTS_ESCAPE, inputStr);
    return escapeXML === false ? str : entities.encodeXML(str);
}

/**
 * Unescape markdown syntax
 * We unescape all entities (HTML + XML)
 *
 * @param {String} str
 * @return {String}
 */
function unescape(str) {
    return entities.decodeHTML(unescapeWith(REPLACEMENTS_UNESCAPE, str));
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
function replace(regex, opt = '') {
    let { source } = regex;

    return function self(name, val) {
        if (!name) return new RegExp(source, opt);
        let { source: valSource = val } = val;
        valSource = valSource.replace(/(^|[^[])\^/g, '$1');
        source = source.replace(name, valSource);
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

    const normRefID = refID.replace(/\s+/g, ' ').toLowerCase();

    const data = refs.get(normRefID);
    if (!data) {
        return undefined;
    }

    return Map(data).filter(Boolean);
}

/**
 * Wrap inline content with the provided characters.
 * e.g wrapInline('bold content', '**')
 * @param {String} str
 * @param {String} chars
 */
function wrapInline(str, chars) {
    return str
        .replace(/^\s*/, spaces => `${spaces}${chars}`)
        .replace(/\s*$/, spaces => `${chars}${spaces}`);
}

export {
    escape,
    unescape,
    escapeURL,
    unescapeURL,
    replace,
    resolveRef,
    wrapInline
};
