import { Serializer, BLOCKS } from '../../';

/**
 * Serialize a footnote block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.FOOTNOTE)
    .then(state => {
        const node = state.peek();
        const text = state.serialize(node.nodes);
        const refname = node.data.get('id');

        return state.shift().write(
            `<blockquote id="fn_${refname}">
<sup>${refname}</sup>. ${text}
<a href="#reffn_${refname}" title="Jump back to footnote [${refname}] in the text."> &#8617;</a>
</blockquote>
`
        );
    });

export default { serialize };
