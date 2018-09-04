import BLOCKS from './blocks';
import INLINES from './inlines';

const VOID = {
    [BLOCKS.HR]: true,
    [INLINES.IMAGE]: true
};

export default VOID;
