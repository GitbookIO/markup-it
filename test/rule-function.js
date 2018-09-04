import expect from 'expect';
import RuleFunction from '../src/models/rule-function';
import State from '../src/models/state';

describe('RuleFunction', () => {
    describe('.compose()', () => {
        it('should return a new RuleFunction', () => {
            const ruleFunction = new RuleFunction();
            const composed = ruleFunction.compose(() => {});

            expect(composed).toNotBe(ruleFunction);
            expect(composed).toBeA(RuleFunction);
        });
    });

    describe('.then()', () => {
        const ruleFunction = new RuleFunction();

        it('should return a new RuleFunction', () => {
            const composed = ruleFunction.then(() => {});

            expect(composed).toNotBe(ruleFunction);
            expect(composed).toBeA(RuleFunction);
        });

        it('should be chainable', () => {
            const composed = ruleFunction
                .then(() => {})
                .then(() => {})
                .then(() => {});

            expect(composed).toNotBe(ruleFunction);
            expect(composed).toBeA(RuleFunction);
        });

        it('should allow to modify the state', () => {
            const letterAdder = state => state.set('text', `${state.text}a`);

            const result = ruleFunction
                .then(letterAdder)
                .then(letterAdder)
                .then(letterAdder)
                .exec(new State());

            expect(result.text).toEqual('aaa');
        });

        it('should execute the functions in the right order', () => {
            const result = ruleFunction
                .then(state => state.set('text', `${state.text}a`))
                .then(state => state.set('text', `${state.text}b`))
                .then(state => state.set('text', `${state.text}c`))
                .exec(new State());

            expect(result.text).toEqual('abc');
        });
    });

    describe('.use()', () => {
        const ruleFunction = new RuleFunction();

        it('should call the alternatives', () => {
            const fn = ruleFunction.use([
                state =>
                    state.text.length > 0
                        ? state.set('text', 'rule-1')
                        : undefined,
                state =>
                    state.text.length == 0
                        ? state.set('text', 'rule-2')
                        : undefined
            ]);

            expect(fn.exec(new State({ text: 'Hello World' })).text).toEqual(
                'rule-1'
            );
            expect(fn.exec(new State({ text: '' })).text).toEqual('rule-2');
        });

        it('should return undefined when no alternative matches', () => {
            const fn = ruleFunction.use([
                state =>
                    state.text.length > 0
                        ? state.set('text', 'rule-1')
                        : undefined,
                state =>
                    state.text.length > 0
                        ? state.set('text', 'rule-2')
                        : undefined
            ]);

            expect(fn.exec(new State({ text: '' }))).toEqual(undefined);
        });

        it('should accept RuleFunction instances as arguments', () => {
            const ruleOne = new RuleFunction()
                .filter(state => state.text.length > 0)
                .then(state => state.set('text', 'rule-1'));

            const ruleTwo = new RuleFunction()
                .filter(state => state.text.length == 0)
                .then(state => state.set('text', 'rule-2'));

            const fn = ruleFunction.use([ruleOne, ruleTwo]);

            expect(fn.exec(new State()).text).toEqual('rule-2');
        });
    });

    describe('.filter()', () => {
        const ruleFunction = new RuleFunction();
        const initialState = new State({ text: '' });
        const letterAdder = state => state.set('text', `${state.text}a`);

        it('should not stop the execution when match is correct', () => {
            const result = ruleFunction
                .filter(state => !state.text.length)
                .then(letterAdder)
                .exec(initialState);

            expect(result.text).toEqual('a');
        });

        it('should stop the execution when match is not correct', () => {
            const result = ruleFunction
                .filter(state => Boolean(state.text.length))
                .then(letterAdder)
                .exec(initialState);

            expect(result).toBe(undefined);
        });
    });
});
