import { BLOCKS } from '../../constants';
import { Serializer } from '../../models';

/**
 * Serialize an HTML block to HTML (pretty easy, huh?)
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.HTML)
    .then(state => {
        const node = state.peek();

        return state.shift().write(`${node.data.get('html')}\n\n`);
    });

export default { serialize };
