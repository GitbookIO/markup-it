const is = require('is');
const { escape } = require('./escape');

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
        return '"' + escape(value) + '"';
    }
    else {
        return String(value);
    }
}

/**
 * Stringify a map of properties.
 * @param  {Map} data
 * @return {String}
 */
function stringifyData(data) {
    return data
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
 * Stringify a custom liquid tag.
 *
 * @param  {Object} tagData
 *    [tagData.type] {String}
 *    [tagData.data] {Map}
 * @return {String}
 */
function stringifyTag({ tag, data }) {
    return `{% ${tag}${data && data.size > 0 ? ' ' + stringifyData(data) : ''} %}`;
}

module.exports = stringifyTag;
