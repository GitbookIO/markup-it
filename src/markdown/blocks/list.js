const trimTrailingLines = require('trim-trailing-lines');
const indentString = require('indent-string');
const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reList = require('../re/block').list;

/**
 * Serialize a list to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType([BLOCKS.UL_LIST, BLOCKS.OL_LIST])
    .then(state => {
        const list = state.peek();
        const { nodes } = list;

        const output = nodes
            .map((item, index) => serializeListItem(state, list, item, index))
            .join('');

        return state.shift().write(output);
    });

/**
 * Deserialize a list to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reList.block, (state, match) => {
    const rawList = match[0];
    const bull = match[2];
    const ordered = bull.length > 1;

    const type = ordered ? BLOCKS.OL_LIST : BLOCKS.UL_LIST;

    let item;
    let loose;
    let data;
    let next = false;

    let lastIndex = 0;
    const nodes = [];
    let rawItem;
    let textItem;
    let space;
    const items = [];

    // Extract all items
    reList.item.lastIndex = 0;
    while (true) {
        item = reList.item.exec(rawList);
        if (item === null) {
            break;
        }

        rawItem = rawList.slice(lastIndex, reList.item.lastIndex);
        lastIndex = reList.item.lastIndex;

        items.push([item, rawItem]);
    }

    for (let i = 0; i < items.length; i += 1) {
        item = items[i][0];
        rawItem = items[i][1];
        data = undefined;

        // Remove the list item's bullet
        // so it is seen as the next token.
        textItem = item[0];
        space = textItem.length;
        textItem = textItem.replace(reList.bulletAndSpaces, '');

        // Parse tasklists
        let checked = reList.checkbox.exec(textItem);
        if (checked) {
            checked = checked[1] === 'x';
            textItem = textItem.replace(reList.checkbox, '');
            data = { checked };
        }

        // Outdent whatever the
        // list item contains. Hacky.
        if (~textItem.indexOf('\n ')) {
            space -= textItem.length;
            textItem = textItem.replace(new RegExp(`^ {1,${space}}`, 'gm'), '');
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(textItem);
        if (i !== items.length - 1) {
            next = textItem.charAt(textItem.length - 1) === '\n';
            if (!loose) loose = next;
        }

        const nodeItem = Block.create({
            type: BLOCKS.LIST_ITEM,
            data,
            nodes: (loose ? state.setProp('looseList', state.depth) : state)
                .use('block')
                .deserialize(textItem)
        });

        nodes.push(nodeItem);
    }

    const listBlock = Block.create({
        type,
        nodes
    });

    return state.push(listBlock);
});

/**
 * Serialize a list item to markdown.
 * @param  {State} state
 * @param  {Block} list
 * @param  {Block} item
 * @param  {Number} index
 * @return {String} output
 */
function serializeListItem(state, list, item, index) {
    // Is it a task item ?
    const hasChecked = item.data.has('checked');
    const isChecked = item.data.get('checked');

    // Is it a loose list?
    const loose = item.nodes.some(child => child.type === BLOCKS.PARAGRAPH);

    // Is it the last item from the list?
    const last = list.nodes.size - 1 === index;

    // Calcul bullet to use
    const bullet = list.type === BLOCKS.OL_LIST ? `${index + 1}.` : '*';

    // Indent all lignes
    const indent = bullet.length + 1;
    let body = state.use('block').serialize(item.nodes);
    // Remove unwanted empty lines added by sub-blocks
    body = `${trimTrailingLines(body)}\n`;

    body = indentString(body, ' ', indent).slice(indent);

    if (loose || last) {
        // Add empty line
        body += '\n';
    }

    if (hasChecked) {
        body = `${isChecked ? '[x]' : '[ ]'} ${body}`;
    }

    return `${bullet} ${body}`;
}

module.exports = { serialize, deserialize };
