import BLOCKS from './blocks';
import INLINES from './inlines';

const VOID = {
    [BLOCKS.HR]: true,
    [BLOCKS.HTML]: true,
    [BLOCKS.COMMENT]: true,
    [INLINES.IMAGE]: true
};

export default VOID;
