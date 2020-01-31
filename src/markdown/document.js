import { Document } from '@gitbook/slate';
import { safeDump as safeDumpYAML } from 'js-yaml';
import fm from 'front-matter';
import Immutable from 'immutable';
import { Deserializer, Serializer } from '../models';

/**
 * Serialize a document to markdown.
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('document')
    .then(state => {
        const node = state.peek();
        const { data, nodes } = node;
        const body = state.use('block').serialize(nodes);

        if (data.size === 0) {
            return state.shift().write(body);
        }

        const frontMatter = `---\n${safeDumpYAML(data.toJS(), {
            skipInvalid: true
        })}---\n\n`;

        return state.shift().write(frontMatter + body);
    });

/**
 * Deserialize a document.
 * @type {Deserializer}
 */
const deserialize = Deserializer().then(state => {
    const { text } = state;

    const { body, attributes } = parseFrontMatter(text);

    const nodes = state.use('block').deserialize(body);
    const data = Immutable.fromJS(attributes);

    const node = Document.create({
        data,
        nodes
    });

    return state.skip(text.length).push(node);
});

/**
 * Extracts front matter from a text
 * Returns the actual text body and the front matter attributes as an object
 * @param  {String} fullText
 * @return {Object} { body: String, frontMatter: Object }
 */
function parseFrontMatter(fullText) {
    // Gracefully parse front matter
    // Invalid (non-parsable or string only) is considered as part of the text
    try {
        const parsed = fm(fullText);
        const { body, attributes } = parsed;

        // If the result of parsing is a string,
        // we consider it as simple text
        if (typeof attributes === 'string') {
            return {
                body: fullText,
                attributes: {}
            };
        }

        return {
            body,
            attributes
        };
    } catch (error) {
        // In case of error, we consider the front matter invalid
        // and parse it as normal text
        return {
            body: fullText,
            attributes: {}
        };
    }
}

export default { serialize, deserialize };
