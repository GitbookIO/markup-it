import { List } from 'immutable';
import { RuleFunction } from './rule-function';

class Deserializer extends RuleFunction {
    /**
     * Match text using a regexp, and move the state to the right position.
     *
     * @param {RegExp | Array<RegExp>} re
     * @param {Function} callback
     * @return {Deserializer}
     */
    matchRegExp(inputRegexps, callback) {
        let regexps = inputRegexps;
        if (!(regexps instanceof Array)) {
            regexps = [regexps];
        }
        regexps = List(regexps);

        let match;
        return this.filter(state =>
            regexps.some(re => {
                match = re.exec(state.text);
                return match;
            })
        ).then(state => callback(state.skip(match[0].length), match));
    }
}

export const DeserializerFactory = () => new Deserializer();
