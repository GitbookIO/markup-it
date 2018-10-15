import is from 'is';
import { Map } from 'immutable';

import escape from './escape';

/**
 * @param {String} tag The HTML tag
 * @param {Boolean} [opts.isSingleTag=false] Render as self-closing tag
 * @param {Function} [opts.getAttrs] Function to get the HTML
 * attributes of the tag, as an Object
 * @return {Function} A function to seralize a node into an HTML tag
 */
function serializeTag(tag, opts = {}) {
    const { isSingleTag = false, getAttrs = node => {} } = opts;

    return state => {
        const node = state.peek();
        const attrs = getAttrs(node);
        const attrsText = attrsToString(attrs);

        let text;
        if (isSingleTag) {
            text = `<${tag}${attrsText}/>`;
        } else {
            const inner = state.serialize(node.nodes);
            text = `<${tag}${attrsText}>${inner}</${tag}>`;
        }

        return state.shift().write(text);
    };
}

/**
 * Convert a map of attributes into a string of HTML attributes.
 * @param {Object} attrs
 * @return {String}
 */
function attrsToString(attrsObject) {
    const attrs = new Map(attrsObject);

    return attrs.reduce((output, value, key) => {
        if (is.undef(value) || is.nil(value)) {
            return output;
        } else if (is.equal(value, '')) {
            return `${output} ${key}`;
        }
        return `${output} ${key}="${escape(value)}"`;
    }, '');
}

export default serializeTag;
