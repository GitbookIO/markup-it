import typeOf from 'type-of';
import uid from 'uid';
import { Text, Mark } from 'slate';
import RuleFunction from './rule-function';

class Serializer extends RuleFunction {
    /**
     * Limit execution of the serializer to a set of node types
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchType(inputMatcher) {
        const matcher = normalizeMatcher(inputMatcher);

        return this.filter(state => {
            const node = state.peek();
            const { type } = node;
            return matcher(type);
        });
    }

    /**
     * Limit execution of the serializer to a "object" of node
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchObject(inputMatcher) {
        const matcher = normalizeMatcher(inputMatcher);

        return this.filter(state => {
            const node = state.peek();
            const { object } = node;
            return matcher(object);
        });
    }

    /**
     * Limit execution of the serializer to leaf containing a certain mark
     * @param {Function || Array || String} matcher
     * @param {Function} transform(State, String, Mark)
     * @return {Serializer}
     */
    matchMark(inputMatcher) {
        const matcher = normalizeMatcher(inputMatcher);

        return this.matchObject('text').filter(state => {
            const text = state.peek();

            return text.getLeaves().some(leaf => {
                const hasMark = leaf.marks.some(mark => matcher(mark.type));
                return hasMark;
            });
        });
    }

    /**
     * Transform all leaves in a text.
     * @param {Function} transform(state: State, leaf: Leaf)
     * @return {Serializer}
     */
    transformLeaves(transform) {
        return this.matchObject('text').then(state => {
            const text = state.peek();
            let leaves = text.getLeaves();

            // Transform leaves
            leaves = leaves.map(leaf => transform(state, leaf));

            // Create new text and push it back
            const newText = Text.create({ leaves });
            return state.shift().unshift(newText);
        });
    }

    /**
     * Transform leaves matching a mark
     * @param {Function || Array || String} matcher
     * @param {Function} transform(state: State, text: String, mark: Mark): String
     * @return {Serializer}
     */
    transformMarkedLeaf(inputMatcher, transform) {
        const matcher = normalizeMatcher(inputMatcher);

        return this.matchMark(matcher).transformLeaves((state, leaf) => {
            let { text, marks } = leaf;
            const mark = leaf.marks.find(({ type }) => matcher(type));
            if (!mark) {
                return leaf;
            }

            text = transform(state, text, mark);
            marks = marks.delete(mark);
            return leaf.merge({ text, marks });
        });
    }

    /**
     * Transform text.
     * @param {Function} transform(state: State, leaf: Leaf): Leaf
     * @return {Serializer}
     */
    transformText(transform) {
        const MARK = uid();

        return (
            this.matchObject('text')

                // We can't process empty text node
                .filter(state => {
                    const text = state.peek();
                    return !text.isEmpty;
                })

                // Avoid infinite loop
                .filterNot(new Serializer().matchMark(MARK))

                // Escape all text
                .transformLeaves((state, inputLeaf) => {
                    const leaf = transform(state, inputLeaf);

                    return leaf.merge({
                        marks: leaf.marks.add(Mark.create({ type: MARK }))
                    });
                })
        );
    }
}

/**
 * Normalize a node matching plugin option.
 *
 * @param {Function || Array || String} matchIn
 * @return {Function}
 */

function normalizeMatcher(matcher) {
    switch (typeOf(matcher)) {
        case 'function':
            return matcher;
        case 'array':
            return type => matcher.includes(type);
        case 'string':
            return type => type == matcher;
        default:
            throw new Error('Cannot normalize matcher');
    }
}

export default () => new Serializer();
