import { Serializer, BLOCKS } from '../../';

/**
 * Return true if a list node contains task items.
 * @param {Block} list
 * @return {Boolean}
 */
function containsTaskList(list) {
    const { nodes } = list;
    return nodes.some(item => item.data.has('checked'));
}

/**
 * Serialize a unordered list to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType([BLOCKS.OL_LIST, BLOCKS.UL_LIST])
    .then(state => {
        const node = state.peek();
        const tag = node.type === BLOCKS.OL_LIST ? 'ol' : 'ul';
        const isTaskList = containsTaskList(node);
        const inner = state.serialize(node.nodes);

        return state
            .shift()
            .write(
                `<${tag}${
                    isTaskList ? ' class="contains-task-list"' : ''
                }>\n${inner}</${tag}>\n`
            );
    });

export default { serialize };
