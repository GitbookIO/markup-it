import { Block } from '@gitbook/slate';
import { BLOCKS } from '../../constants';
import { Serializer, Deserializer } from '../../models';
import reBlock from '../re/block';

/**
 * Serialize a comment to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.COMMENT)
    .then(state => {
        const node = state.peek();
        const { data } = node;
        const text = data.get('text');

        return state.shift().write(`{# ${text} #}`);
    });

/**
 * Deserialize a comment to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(
    reBlock.comment,
    (state, match) => {
        if (state.getProp('template') === false) {
            return undefined;
        }

        const node = Block.create({
            type: BLOCKS.COMMENT,
            isVoid: true,
            data: {
                text: match[1].trim()
            }
        });

        return state.push(node);
    }
);

export default { serialize, deserialize };
