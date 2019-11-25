import { BLOCKS } from '../../constants';
import { Serializer } from '../../models';

/**
 * Serialize an unstyled block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TEXT)
    .then(state => {
        // Ignore the block, but still serialize its content
        const node = state.peek();
        return state.shift().write(state.serialize(node.nodes));
    });

export default { serialize };
