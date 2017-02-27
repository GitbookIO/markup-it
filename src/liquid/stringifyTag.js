const is = require('is');
const { Map } = require('immutable');

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
    return (Map.isMap(props) ? props : Map(props))
        .entrySeq()
        .map(([ key, value ]) => {
            const isArgs = Number(key) >= 0;
            value = stringifyLiteral(value);

            if (isArgs) {
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
    const _props = stringifyProps(props);
    return `{% ${tag}${_props ? ' ' + _props : ''} %}`;
}

module.exports = stringifyTag;
