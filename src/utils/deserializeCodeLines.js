import splitLines from 'split-lines';
import { Block, Text } from 'slate';
import BLOCKS from '../constants/blocks';

/**
 * Deserialize the inner text of a code block
 * @param  {String} text
 * @return {Array<Node>} nodes
 */
function deserializeCodeLines(text) {
    const lines = splitLines(text);

    return lines.map(line =>
        Block.create({
            type: BLOCKS.CODE_LINE,
            nodes: [Text.create(line)]
        })
    );
}

export default deserializeCodeLines;
