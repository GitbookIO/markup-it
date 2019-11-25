import trimNewlines from 'trim-newlines';
import { Block } from '@gitbook/slate';
import { BLOCKS } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import { deserializeCodeLines } from '../../utils';
import reBlock from '../re/block';
import { escape, unescape } from '../utils';

/**
 * Serialize a code block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then(state => {
        const node = state.peek();
        const { nodes, data } = node;

        // Escape the syntax
        // http://spec.commonmark.org/0.15/#example-234
        const syntax = escape(data.get('syntax') || '');

        // Get inner content and number of fences
        const innerText = nodes.map(line => line.text).join('\n');
        const hasFences = innerText.indexOf('`') >= 0;

        let output;

        // Use fences if syntax is set
        if (!hasFences || syntax) {
            output = `${'```'}${syntax || ''}\n${innerText}\n${'```'}\n\n`;

            return state.shift().write(output);
        }

        output = `${nodes
            .map(({ text }) => {
                if (!text.trim()) {
                    return '';
                }
                return `    ${text}`;
            })
            .join('\n')}\n\n`;

        return state.shift().write(output);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserializeFences = Deserializer().matchRegExp(
    reBlock.fences,
    (state, match) => {
        // Extract code block text, and trim empty lines
        const text = trimNewlines(match[3]);

        // Extract language syntax
        let data;
        if (match[2]) {
            data = {
                syntax: unescape(match[2].trim())
            };
        }

        // Split lines
        const nodes = deserializeCodeLines(text);

        const node = Block.create({
            type: BLOCKS.CODE,
            nodes,
            data
        });

        return state.push(node);
    }
);

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
const deserializeTabs = Deserializer().matchRegExp(
    reBlock.code,
    (state, match) => {
        let inner = match[0];

        // Remove indentation
        inner = inner.replace(/^( {4}|\t)/gm, '');

        // No pedantic mode
        inner = inner.replace(/\n+$/, '');

        // Split lines
        const nodes = deserializeCodeLines(inner);

        const node = Block.create({
            type: BLOCKS.CODE,
            nodes
        });

        return state.push(node);
    }
);

const deserialize = Deserializer().use([deserializeFences, deserializeTabs]);

export default { serialize, deserialize };
