import { Serializer, Deserializer, Block, BLOCKS } from '../../';
import reHeading from '../re/heading';
import escape from '../../html/escape';

const TYPES = [
    BLOCKS.HEADING_1,
    BLOCKS.HEADING_2,
    BLOCKS.HEADING_3,
    BLOCKS.HEADING_4,
    BLOCKS.HEADING_5,
    BLOCKS.HEADING_6
];

/**
 * Serialize an heading node to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(TYPES)
    .then(state => {
        const node = state.peek();
        const { type, data } = node;
        const id = data.get('id');
        const depth = TYPES.indexOf(type);
        const prefix = Array(depth + 2).join('#');

        let inner = state.use('inline').serialize(node.nodes);
        if (id) {
            inner = `${inner} <a id="${escape(id)}"></a>`;
        }

        return state.shift().write(`${prefix} ${inner}\n\n`);
    });

/**
 * Deserialize a normal heading (starting with "#..") and headings using
 * line syntax to a node.
 * @type {Deserializer}
 */
const deserializeNormal = Deserializer().matchRegExp(
    reHeading.normal,
    (state, match) => {
        const level = match[1].length;
        return parseHeadingText(state, level, match[2]);
    }
);

/**
 * Deserialize a line heading.
 * @type {Deserializer}
 */
const deserializeLine = Deserializer().matchRegExp(
    reHeading.line,
    (state, match) => {
        const level = match[2] === '=' ? 1 : 2;
        return parseHeadingText(state, level, match[1]);
    }
);

const deserialize = Deserializer().use([deserializeNormal, deserializeLine]);

/**
 * Trim text left on a List of Nodes
 * @param  {List<Node>} nodes
 * @return {List<Node>}
 */
function trimLeftNodesText(nodes) {
    if (nodes.size === 0) {
        return nodes;
    }

    const firstNode = nodes.first();
    // We don't want to trim complicated blocks
    if (firstNode.object !== 'text') {
        return nodes;
    }

    const leaves = firstNode.getLeaves();
    const firstLeaf = leaves.first();

    return nodes.rest().unshift(
        firstNode.setLeaves(
            leaves.rest().unshift(
                firstLeaf.merge({
                    text: firstLeaf.text.trimLeft()
                })
            )
        )
    );
}

/**
 * Trim text right on a List of Nodes
 * @param  {List<Node>} nodes
 * @return {List<Node>}
 */
function trimRightNodesText(nodes) {
    if (nodes.size === 0) {
        return nodes;
    }

    const lastNode = nodes.last();
    // We don't want to trim complicated blocks
    if (lastNode.object !== 'text') {
        return nodes;
    }

    const leaves = lastNode.getLeaves();
    const lastLeaf = leaves.last();

    return nodes.butLast().push(
        lastNode.setLeaves(
            leaves.butLast().push(
                lastLeaf.merge({
                    text: lastLeaf.text.trimRight()
                })
            )
        )
    );
}

/**
 * Parse inner text of header to extract ID entity
 * @param  {State} state
 * @param  {Number} level
 * @param  {String} initialText
 * @return {State}
 */
function parseHeadingText(state, level, initialText) {
    let text = initialText;
    reHeading.id.lastIndex = 0;
    const matchId = reHeading.id.exec(text);
    let data;

    if (matchId) {
        // Remove ID from text
        text = text.replace(matchId[0], '').trim();
    } else {
        text = text.trim();
    }

    const newState = state
        .down({ text })
        .use('inline')
        .lex();

    // Use the custom ID, or use the id of the last anchor found (see anchors tests)
    const id =
        (matchId && matchId[2]) || newState.getProp('lastAnchorId') || null;
    if (id) {
        data = { id };
    }

    const trimmedLeftNodes = trimLeftNodesText(newState.nodes);
    const trimmedNodes = trimRightNodesText(trimmedLeftNodes);

    const node = Block.create({
        type: TYPES[level - 1],
        nodes: trimmedNodes,
        data
    });

    return (
        newState
            .up()
            // We have consumed any anchor ID that was seen recently
            .setProp('lastAnchorId', null)
            .push(node)
    );
}

export default { serialize, deserialize };
