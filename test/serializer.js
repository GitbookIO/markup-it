const expect     = require('expect');
const { Text }   = require('slate');
const Serializer = require('../src/models/serializer');
const State      = require('../src/models/state');

describe('Serializer', () => {
    const blockNode = {
        type: 'paragraph',
        kind: 'block'
    };
    const state = (new State()).push(blockNode);

    describe('.matchType()', () => {
        it('should continue execution when passed a correct string', () => {
            const result = Serializer()
                .matchType('paragraph')
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct array', () => {
            const result = Serializer()
                .matchType([ 'code_block', 'paragraph' ])
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct function', () => {
            const result = Serializer()
                .matchType(type => type == 'paragraph')
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should return undefined when passed an incorrect value', () => {
            const result = Serializer()
                .matchType(() => {})
                .then(() => true)
                .exec(state);

            expect(result).toBe(undefined);
        });
    });

    describe('.matchKind()', () => {
        it('should continue execution when passed a correct string', () => {
            const result = Serializer()
                .matchKind('block')
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct array', () => {
            const result = Serializer()
                .matchKind([ 'text', 'block' ])
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct function', () => {
            const result = Serializer()
                .matchKind(kind => kind == 'block')
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should return undefined when passed an incorrect value', () => {
            const result = Serializer()
                .matchKind(() => {})
                .then(() => true)
                .exec(state);

            expect(result).toBe(undefined);
        });
    });

    describe('.transformRanges()', () => {
        const textState = State.create().push(Text.create({
            ranges: [
                { text: 'hello' },
                { text: 'world', marks: [ { type: 'bold'} ] }
            ]
        }));

        it('should update all ranges in a text', () => {
            const node = Serializer()
                .transformRanges((st, range) => {
                    return range.merge({ text: `[${range.text}]` });
                })
                .then(st => st.peek())
                .exec(textState);

            expect(node.text).toBe('[hello][world]');
            expect(node.getRanges().size).toBe(2);
        });
    });

    describe('.transformMarkedRange()', () => {
        const textState = State.create().push(Text.create({
            ranges: [
                { text: 'hello' },
                { text: 'world', marks: [ { type: 'bold'} ] }
            ]
        }));

        it('should update all matching ranges in a text', () => {
            const node = Serializer()
                .transformMarkedRange('bold', (st, text) => {
                    return `[${text}]`;
                })
                .then(st => st.peek())
                .exec(textState);

            expect(node.text).toBe('hello[world]');

            const ranges = node.getRanges();
            expect(ranges.size).toBe(1);
            expect(ranges.get(0).marks.size).toBe(0);
        });
    });
});
