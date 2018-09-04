import { Record } from 'immutable';

const DEFAULTS = {
    transform: state => state
};

class RuleFunction extends Record(DEFAULTS) {
    /**
     * Execute a rule function or a function.
     * @param {Function or RuleFunction} fn
     * @param {Mixed} ...args
     * @return {Mixed} result
     */
    static exec(fn, ...args) {
        return fn instanceof RuleFunction ? fn.exec(...args) : fn(...args);
    }

    /**
     * Add a composition to the transform function
     * @param  {Function} composer
     * @return {RuleFunction}
     */
    compose(composer) {
        let { transform } = this;

        transform = composer(transform);
        return this.merge({ transform });
    }

    /**
     * Push a transformation to the stack of execution.
     * @param  {Function} next
     * @return {RuleFunction}
     */
    then(next) {
        return this.compose(prev => state => {
            const prevState = prev(state);
            if (typeof prevState == 'undefined') {
                return undefined;
            }

            return next(prevState);
        });
    }

    /**
     * Push an interceptor withut changing the end value.
     * @param  {Function} interceptor
     * @return {RuleFunction}
     */
    tap(interceptor) {
        return this.compose(prev => state => {
            const prevState = prev(state);

            interceptor(prevState);

            return prevState;
        });
    }

    /**
     * Try multiple alternatives
     * @param  {Function} alternatives
     * @return {RuleFunction}
     */
    use(alternatives) {
        return this.then(state => {
            let newState;

            alternatives.some(fn => {
                newState = RuleFunction.exec(fn, state);
                return Boolean(newState);
            });

            return newState;
        });
    }

    /**
     * Prevent applying the transform function if <match> is false
     * @param  {Function} match
     * @return {RuleFunction}
     */
    filter(match) {
        return this.compose(prev => state => {
            const prevState = prev(state);

            if (!prevState || !match(prevState)) {
                return undefined;
            }

            return prevState;
        });
    }

    /**
     * Prevent applying the transform function if <match> returns true
     * @param  {Function} match
     * @return {RuleFunction}
     */
    filterNot(match) {
        return this.filter(state => !RuleFunction.exec(match, state));
    }

    /**
     * Execute the transform function on an input
     * @param  {State} state
     * @param  {Object} value
     * @return {Object}
     */
    exec(state, value) {
        return this.transform(state);
    }
}

export default RuleFunction;
