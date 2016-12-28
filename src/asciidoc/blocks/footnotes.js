const { Map } = require('immutable');
const { Serializer, BLOCKS } = require('../../');

/**
 * Index all footnotes in the document.
 * @type {Serializer}
 */
const serialize = Serializer()
    .then((state) => {
        let { depth, nodes } = state;
        const footnotes = {};

        if (depth > 1 || state.getProp('footnotes')) {
            return;
        }

        nodes = nodes.filter(node => {
            if (node.type !== BLOCKS.FOOTNOTE) {
                return true;
            }

            const inner = state.use('inline').serialize(node.nodes);
            const id = node.data.get('id');

            footnotes[id] = inner;

            return false;
        });

        return state
            .setProp('footnotes', Map(footnotes))
            .merge({ nodes });
    });


module.exports = { serialize };
