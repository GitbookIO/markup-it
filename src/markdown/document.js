import { Document } from '@gitbook/slate';
import yaml from 'js-yaml';
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

        const frontMatter = `---\n${yaml.safeDump(data.toJS(), {
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
    const parsed = fm(text);

    const nodes = state.use('block').deserialize(parsed.body);
    const data = Immutable.fromJS(parsed.attributes);

    const node = Document.create({
        data,
        nodes
    });

    return state.skip(text.length).push(node);
});

export default { serialize, deserialize };
