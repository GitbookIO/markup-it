import { Serializer, Deserializer } from '../../';
import reInline from '../re/inline';

/**
 * Replace hardline break by two spaces followed by a newline
 *
 * @type {Serializer}
 */
const serialize = Serializer().transformText((state, leaf) => {
    const { text } = leaf;
    const allowHardlineBreak = state.getProp('hardlineBreak');
    const replaceWith = allowHardlineBreak ? '  \n' : ' ';

    return leaf.merge({
        text: text.replace(/\n/g, replaceWith)
    });
});

/**
 * Deserialize hardline break.
 * http://spec.commonmark.org/0.26/#hard-line-break
 *
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reInline.br, (state, match) =>
    state.pushText('\n')
);

export default { serialize, deserialize };
