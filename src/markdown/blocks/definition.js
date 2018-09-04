import { Map } from 'immutable';
import { Deserializer } from '../../';

const reDef = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;

/**
 * Cleanup a text before parsing: normalize newlines and tabs
 *
 * @param {String} src
 * @return {String}
 */
function cleanupText(src) {
    return src
        .replace(/\r\n|\r/g, '\n')
        .replace(/\t/g, '    ')
        .replace(/\u00a0/g, ' ')
        .replace(/\u2424/g, '\n')
        .replace(/^ +$/gm, '');
}

/**
 * Deserialize all definitions in a markdown document and store them as
 * "refs" prop.
 * @type {Deserializer}
 */
const deserialize = Deserializer().then(state => {
    const { depth, nodes } = state;
    let { text } = state;

    // Apply it as first rule only
    if (depth > 2 || nodes.size > 0 || state.getProp('refs')) {
        return undefined;
    }

    // Normalize the text
    text = cleanupText(text);

    const refs = {};

    // Parse all definitions
    text = text.replace(
        reDef,
        (wholeMatch, linkId, href, width, height, blankLines, title) => {
            refs[linkId.toLowerCase()] = {
                href,
                title
            };

            return '';
        }
    );

    return state.replaceText(text).setProp('refs', Map(refs));
});

export default { deserialize };
