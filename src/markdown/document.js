import { Document } from '@gitbook/slate';
import { safeDump as safeDumpYAML } from 'js-yaml';
import gm from 'gray-matter';
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

    // Parse front matter gracefully
    // If we can't parse it, or the content is only a string, we parse at using
    // the classic MarkdownParser rules
    let parsedContent = '';
    let parsedData = {};

    try {
        const parsed = gm(text);
        ({ content: parsedContent, data: parsedData } = parsed);
    } catch (error) {
        // In case of error, we leave the data empty and parse the whole text
        parsedContent = text;
    }

    // In case we parsed front matter as a simple string,
    // we parse the whole text
    if (typeof parsedData === 'string') {
        parsedContent = text;
        parsedData = {};
    }

    const nodes = state.use('block').deserialize(parsedContent);
    const data = Immutable.fromJS(parsedData);

    const node = Document.create({
        data,
        nodes
    });

    return state.skip(text.length).push(node);
});

export default { serialize, deserialize };
