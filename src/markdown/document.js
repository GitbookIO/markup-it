const yaml = require('js-yaml');
const fm = require('front-matter');
const Immutable = require('immutable');
const { Serializer, Deserializer, Document } = require('../');

/**
 * Serialize a document to markdown.
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchKind('document')
    .then((state) => {
        const node = state.peek();
        const { data, nodes } = node;
        const body = state.use('block').serialize(nodes);

        if (data.size === 0) {
            return body;
        }

        const frontMatter = (
            '---\n' +
            yaml.safeDump(data.toJS(), { skipInvalid: true }) +
            '---\n\n'
        );

        return state
            .shift()
            .write(frontMatter + body);
    });

/**
 * Deserialize a document.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .then((state) => {
        const { text } = state;
        const parsed = fm(text);

        const nodes = state.use('block').deserialize(parsed.body);
        const data = Immutable.fromJS(parsed.attributes);

        const node = Document.create({
            data,
            nodes
        });

        return state
            .skip(text.length)
            .push(node);
    });

module.exports = { serialize, deserialize };
