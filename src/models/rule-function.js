const { Record } = require('immutable');

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
            state = prev(state);
            if (typeof state == 'undefined') {
                return;
            }

            return next(state);
        });
    }

    /**
     * Push an interceptor withut changing the end value.
     * @param  {Function} interceptor
     * @return {RuleFunction}
     */
    tap(interceptor) {
        return this.compose(prev => state => {
            state = prev(state);

            interceptor(state);

            return state;
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
            state = prev(state);

            if (!state || !match(state)) {
                return;
            }

            return state;
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

module.exports = RuleFunction;
