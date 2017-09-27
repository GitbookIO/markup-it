const splitLines = require('split-lines');
const { Block, Text } = require('slate');

const BLOCKS = require('../constants/blocks');

/**
 * Deserialize the inner text of a code block
 * @param  {String} text
 * @return {Array<Node>} nodes
 */
function deserializeCodeLines(text) {
    const lines = splitLines(text);

    return lines
        .map(line => Block.create({
            type: BLOCKS.CODE_LINE,
            nodes: [
                Text.create(line)
            ]
        }));
}

module.exports = deserializeCodeLines;
