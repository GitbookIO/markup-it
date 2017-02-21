const is = require('is');

/**
 * Stringify a literal
 * @param  {Mixed} value
 * @return {String}
 */
function stringifyLiteral(value) {
    if (is.bool(value)) {
        return (value ? 'true' : 'false');
    }
    else if (is.string(value)) {
        return '"' + value.replace(/\"/g,'\\"') + '"';
    }
    else {
        return String(value);
    }
}

/**
 * Stringify a map of props
 * @param  {Map} props
 * @return {String}
 */
function stringifyProps(props) {
    return props
        .entrySeq()
        .map(([ key, value ]) => {
            const isKwargs = is.number(key);
            value = stringifyLiteral(value);

            if (!isKwargs) {
                return value;
            }

            return `${key}=${value}`;
        })
        .join(' ');
}

/**
 * Stringify a tag.
 * @param  {Object} tagData
 *    [tagData.tag] {String}
 *    [tagData.props] {Map}
 * @return {String}
 */
function stringifyTag({ tag, props }) {
    console.log({ tag, props });
    const _props = stringifyProps(props);
    return `{% ${tag}${_props ? ' ' + _props : ''} %}`;
}

module.exports = stringifyTag;
