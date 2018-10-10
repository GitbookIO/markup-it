import { Serializer, Deserializer, Block, BLOCKS } from '../../';
import reBlock from '../re/block';

/**
 * Serialize a paragraph to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then(state => {
        const node = state.peek();
        const inner = state
            .use('inline')
            .setProp('hardlineBreak', true)
            .serialize(node.nodes);

        return state.shift().write(`${inner}\n\n`);
    });

/**
 * Deserialize a paragraph to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reBlock.paragraph,
    (state, match) => {
        const parentDepth = state.depth - 1;
        const isInBlockquote = state.getProp('blockquote') === parentDepth;
        const isInLooseList = state.getProp('looseList') === parentDepth;
        const isTop = state.depth === 2;

        if (!isTop && !isInBlockquote && !isInLooseList) {
            return undefined;
        }

        const text = collapseWhiteSpaces(match[1]);

        const newState = state
            .down({ text })
            .use('inline')
            .lex();

        const { nodes } = newState;

        const node = Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes
        });

        return newState.up().push(node);
    }
);

/*
 * Collapse newlines and whitespaces into a single whitespace. But preserve
 * hardline breaks '··⏎'
 */
function collapseWhiteSpaces(text) {
    return (
        text
            // Remove hardline breaks
            .split('  \n')
            .map(part => part.trim().replace(/\s+/g, ' '))
            // Restore hardline breaks
            .join('  \n')
            .trim()
    );
}

export default { serialize, deserialize };
