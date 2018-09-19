import expect from 'expect';
import { Text } from '@gitbook/slate';
import Serializer from '../src/models/serializer';
import State from '../src/models/state';

describe('Serializer', () => {
    const blockNode = {
        type: 'paragraph',
        object: 'block'
    };
    const state = new State().push(blockNode);

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
                .matchType(['code_block', 'paragraph'])
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

    describe('.matchObject()', () => {
        it('should continue execution when passed a correct string', () => {
            const result = Serializer()
                .matchObject('block')
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct array', () => {
            const result = Serializer()
                .matchObject(['text', 'block'])
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should continue execution when passed a correct function', () => {
            const result = Serializer()
                .matchObject(object => object == 'block')
                .then(() => true)
                .exec(state);

            expect(result).toBe(true);
        });

        it('should return undefined when passed an incorrect value', () => {
            const result = Serializer()
                .matchObject(() => {})
                .then(() => true)
                .exec(state);

            expect(result).toBe(undefined);
        });
    });

    describe('.transformLeaves()', () => {
        const textState = State.create().push(
            Text.create({
                leaves: [
                    { text: 'hello' },
                    { text: 'world', marks: [{ type: 'bold' }] }
                ]
            })
        );

        it('should update all leaves in a text', () => {
            const node = Serializer()
                .transformLeaves((st, leaf) =>
                    leaf.merge({ text: `[${leaf.text}]` })
                )
                .then(st => st.peek())
                .exec(textState);

            expect(node.text).toBe('[hello][world]');
            expect(node.getLeaves().size).toBe(2);
        });
    });

    describe('.transformMarkedLeaf()', () => {
        const textState = State.create().push(
            Text.create({
                leaves: [
                    { text: 'hello' },
                    { text: 'world', marks: [{ type: 'bold' }] }
                ]
            })
        );

        it('should update all matching leaves in a text', () => {
            const node = Serializer()
                .transformMarkedLeaf('bold', (st, text) => `[${text}]`)
                .then(st => st.peek())
                .exec(textState);

            expect(node.text).toBe('hello[world]');

            const leaves = node.getLeaves();
            expect(leaves.size).toBe(1);
            expect(leaves.get(0).marks.size).toBe(0);
        });
    });
});
