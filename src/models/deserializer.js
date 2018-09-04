const { List } = require('immutable');
const RuleFunction = require('./rule-function');

class Deserializer extends RuleFunction {
    /**
     * Match text using a regexp, and move the state to the right position.
     *
     * @param {RegExp | Array<RegExp>} re
     * @param {Function} callback
     * @return {Deserializer}
     */
    matchRegExp(res, callback) {
        if (!(res instanceof Array)) {
            res = [res];
        }
        res = List(res);

        let match;
        return this.filter(state =>
            res.some(re => {
                match = re.exec(state.text);
                return match;
            })
        ).then(state => {
            state = state.skip(match[0].length);
            return callback(state, match);
        });
    }
}

module.exports = () => new Deserializer();
