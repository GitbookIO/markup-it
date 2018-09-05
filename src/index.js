import { Document, Block, Inline, Text, Mark, Leaf } from 'slate';
import State from './models/state';
import Deserializer from './models/deserializer';
import Serializer from './models/serializer';
import MARKS from './constants/marks';
import BLOCKS from './constants/blocks';
import INLINES from './constants/inlines';
import VOID from './constants/void';
import CONTAINERS from './constants/containers';
import LEAFS from './constants/leafs';
import TABLE_ALIGN from './constants/table-align';

export {
    State,
    Serializer,
    Deserializer,
    // Constants
    MARKS,
    BLOCKS,
    INLINES,
    TABLE_ALIGN,
    CONTAINERS,
    LEAFS,
    VOID,
    // Slate exports
    Document,
    Block,
    Inline,
    Text,
    Mark,
    Leaf
};
