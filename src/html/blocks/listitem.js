const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a list item to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.LIST_ITEM)
    .then(state => {
        const node = state.peek();
        let inner = state.serialize(node.nodes);
        let tag = '<li>';

        const isTaskList = node.data.has('checked');
        const isChecked = node.data.get('checked');

        if (isTaskList) {
            tag = '<li class="task-list-item">';
            inner = `<input type="checkbox" class="task-list-item-checkbox"${isChecked ? ' checked' : ''} disabled /> ${inner}`;
        }

        return state
            .shift()
            .write(`${tag}${inner}</li>\n`);
    });

module.exports = { serialize };
