const splitLines = require('split-lines');
const { Serializer, Deserializer, Block, Text, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Deserialize the inner text of a code block
 * @param  {String} text
 * @return {Array<Node>} nodes
 */
function deserializeLines(text) {
    const lines = splitLines(text);

    return lines
        .map(line => Block.create({
            type: BLOCKS.CODE_LINE,
            nodes: [
                Text.createFromString(line)
            ]
        }));
}

/**
 * Serialize a code block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then((state) => {
        const node = state.peek();
        const { nodes, data } = node;
        const syntax = data.get('syntax');

        const innerText = nodes
            .map(line => line.text)
            .join('\n');
        const hasFences = innerText.indexOf('`') >= 0;
        let output;

        // Use fences if syntax is set
        if (!hasFences || syntax) {
            output = `${'```'}${Boolean(syntax) ? syntax : ''}\n` +
                     `${innerText}\n` +
                     `${'```'}\n\n`;

            return state
                .shift()
                .write(output);
        }

        output = nodes
            .map(({ text }) => {
                if (!text.trim()) return '';
                return '    ' + text;
            })
            .join('\n') + '\n\n';

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserializeFences = Deserializer()
    .matchRegExp(reBlock.fences, (state, match) => {
        // Extract code block text
        const text = match[3].trim();

        // Extract language syntax
        let data;
        if (Boolean(match[2])) {
            data = {
                syntax: match[2].trim()
            };
        }

        // Split lines
        const nodes = deserializeLines(text);

        const node = Block.create({
            type: BLOCKS.CODE,
            nodes,
            data
        });

        return state.push(node);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserializeTabs = Deserializer()
    .matchRegExp(reBlock.code, (state, match) => {
        let inner = match[0];

        // Remove indentation
        inner = inner.replace(/^( {4}|\t)/gm, '');

        // No pedantic mode
        inner = inner.replace(/\n+$/, '');

        // Split lines
        const nodes = deserializeLines(inner);

        const node = Block.create({
            type: BLOCKS.CODE,
            nodes
        });

        return state.push(node);
    });

const deserialize = Deserializer()
    .use([
        deserializeFences,
        deserializeTabs
    ]);

module.exports = { serialize, deserialize };
