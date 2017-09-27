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
     * Limit execution of the serializer to a kind of node
     * @param {Function || Array || String} matcher
     * @return {Serializer}
     */
    matchKind(matcher) {
        matcher = normalizeMatcher(matcher);

        return this.filter(state => {
            const node = state.peek();
            const { kind } = node;
            return matcher(kind);
        });
    }

    /**
     * Limit execution of the serializer to range containing a certain mark
     * @param {Function || Array || String} matcher
     * @param {Function} transform(State, String, Mark)
     * @return {Serializer}
     */
    matchMark(matcher) {
        matcher = normalizeMatcher(matcher);

        return this
        .matchKind('text')
        .filter(state => {
            const text = state.peek();

            return text.characters.some(char => {
                const hasMark = char.marks.some(mark => matcher(mark.type));
                return hasMark;
            });
        });
    }

    /**
     * Transform all ranges in a text.
     * @param {Function} transform(state: State, range: Range)
     * @return {Serializer}
     */
    transformRanges(transform) {
        return this
        .matchKind('text')
        .then(state => {
            const text = state.peek();
            let ranges = text.getRanges();

            // Transform ranges
            ranges = ranges.map(range => transform(state, range));

            // Create new text and push it back
            const newText = Text.create({ ranges });
            return state
                .shift()
                .unshift(newText);
        });
    }

    /**
     * Transform ranges matching a mark
     * @param {Function || Array || String} matcher
     * @param {Function} transform(state: State, text: String, mark: Mark): String
     * @return {Serializer}
     */
    transformMarkedRange(matcher, transform) {
        matcher = normalizeMatcher(matcher);

        return this
        .matchMark(matcher)
        .transformRanges((state, range) => {
            let { text, marks } = range;
            const mark = range.marks.find(({type}) => matcher(type));
            if (!mark) {
                return range;
            }

            text = transform(state, text, mark);
            marks = marks.delete(mark);
            range = range.merge({ text, marks });

            return range;
        });
    }

    /**
     * Transform text.
     * @param {Function} transform(state: State, range: Range): Range
     * @return {Serializer}
     */
    transformText(transform) {
        const MARK = uid();

        return this.matchKind('text')

        // We can't process empty text node
        .filter(state => {
            const text = state.peek();
            return !text.isEmpty;
        })

        // Avoid infinite loop
        .filterNot((new Serializer()).matchMark(MARK))

        // Escape all text
        .transformRanges((state, range) => {
            range = transform(state, range);

            return range.merge({
                marks: range.marks.add(Mark.create({ type: MARK }))
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
