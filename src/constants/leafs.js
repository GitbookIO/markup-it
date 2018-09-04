import BLOCKS from './blocks';

/**
 * Dictionary of all leaf containers (those that can contain inlines or text).

 * @type {Map<String:Boolean>}
 */

export default {
    [BLOCKS.PARAGRAPH]: true,
    [BLOCKS.TEXT]: true,
    [BLOCKS.TABLE_CELL]: true,
    [BLOCKS.CODE_LINE]: true
};
