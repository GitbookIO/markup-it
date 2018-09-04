import { Serializer, BLOCKS } from '../../';
import escape from '../escape';

/**
 * Serialize a code block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CODE)
    .then(state => {
        const node = state.peek();
        const syntax = node.data.get('syntax');
        const text = node.nodes.map(line => line.text).join('\n');

        const className = syntax ? ` class="lang-${syntax}"` : '';

        return state
            .shift()
            .write(`<pre><code${className}>${escape(text)}</code></pre>\n`);
    });

export default { serialize };
