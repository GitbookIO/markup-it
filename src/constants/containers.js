const objectValues = require('object-values');
const BLOCKS = require('./blocks');
const ALL_BLOCKS = objectValues(BLOCKS);

/**
 * Dictionary of all container block types, and the set block types they accept as children.
 * The first value of each set is the default block type.
 *
 * @type {Map<String:Array>}
 */

module.exports = {
    [BLOCKS.DOCUMENT]:   [BLOCKS.PARAGRAPH, ...ALL_BLOCKS],
    [BLOCKS.BLOCKQUOTE]: [BLOCKS.TEXT, ...ALL_BLOCKS],
    [BLOCKS.TABLE]:      [BLOCKS.TABLE_ROW],
    [BLOCKS.TABLE_ROW]:  [BLOCKS.TABLE_CELL],
    [BLOCKS.LIST_ITEM]:  [BLOCKS.TEXT, ...ALL_BLOCKS],
    [BLOCKS.OL_LIST]:    [BLOCKS.LIST_ITEM],
    [BLOCKS.UL_LIST]:    [BLOCKS.LIST_ITEM],
    [BLOCKS.CODE]:       [BLOCKS.CODE_LINE]
};
