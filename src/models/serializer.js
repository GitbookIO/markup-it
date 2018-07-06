const typeOf = require('type-of');
const uid = require('uid');
const { Text, Mark } = require('slate');
const RuleFunction = require('./rule-function');

class Serializer extends RuleFunction {

    /**
     * Limit execution of the serializer to a set of node types
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchType(matcher) {
        matcher = normalizeMatcher(matcher);

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
    matchObject(matcher) {
        matcher = normalizeMatcher(matcher);

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
    matchMark(matcher) {
        matcher = normalizeMatcher(matcher);

        return this
        .matchObject('text')
        .filter(state => {
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
        return this
        .matchObject('text')
        .then(state => {
            const text = state.peek();
            let leaves = text.getLeaves();

            // Transform leaves
            leaves = leaves.map(leaf => transform(state, leaf));

            // Create new text and push it back
            const newText = Text.create({ leaves });
            return state
                .shift()
                .unshift(newText);
        });
    }

    /**
     * Transform leaves matching a mark
     * @param {Function || Array || String} matcher
     * @param {Function} transform(state: State, text: String, mark: Mark): String
     * @return {Serializer}
     */
    transformMarkedLeaf(matcher, transform) {
        matcher = normalizeMatcher(matcher);

        return this
        .matchMark(matcher)
        .transformLeaves((state, leaf) => {
            let { text, marks } = leaf;
            const mark = leaf.marks.find(({type}) => matcher(type));
            if (!mark) {
                return leaf;
            }

            text = transform(state, text, mark);
            marks = marks.delete(mark);
            leaf = leaf.merge({ text, marks });

            return leaf;
        });
    }

    /**
     * Transform text.
     * @param {Function} transform(state: State, leaf: Leaf): Leaf
     * @return {Serializer}
     */
    transformText(transform) {
        const MARK = uid();

        return this.matchObject('text')

        // We can't process empty text node
        .filter(state => {
            const text = state.peek();
            return !text.isEmpty;
        })

        // Avoid infinite loop
        .filterNot((new Serializer()).matchMark(MARK))

        // Escape all text
        .transformLeaves((state, leaf) => {
            leaf = transform(state, leaf);

            return leaf.merge({
                marks: leaf.marks.add(Mark.create({ type: MARK }))
            });
        });
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
    }
}


module.exports = () => new Serializer();
