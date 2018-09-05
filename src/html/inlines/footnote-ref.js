import { Serializer, INLINES } from '../../';

/**
 * Serialize a inline footnote reference to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(INLINES.FOOTNOTE_REF)
    .then(state => {
        const node = state.peek();
        const refname = node.data.get('id');
        return state
            .shift()
            .write(
                `<sup><a href="#fn_${refname}" id="reffn_${refname}">${refname}</a></sup>`
            );
    });

export default { serialize };
