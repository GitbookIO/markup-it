import { Deserializer, State } from '../src';

describe('Deserializer', () => {
    const state = new State();

    describe('.matchRegExp()', () => {
        it('should return undefined when the regexp does not match', () => {
            const result = Deserializer()
                .matchRegExp(/abc/, () => true)
                .exec(state.write('xyz'));

            expect(result).toBe(undefined);
        });

        it('should return the value of the callback when the regexp matches', () => {
            const result = Deserializer()
                .matchRegExp(/.*(abc).*/, (newState, match) => match[1])
                .exec(state.write('abcdefgh'));

            expect(result).toBe('abc');
        });

        it('should return undefined when the callback reject', () => {
            const result = Deserializer()
                .matchRegExp(/.*(abc).*/, (newState, match) => undefined)
                .exec(state.write('abcdefgh'));

            expect(result).toBe(undefined);
        });
    });
});
