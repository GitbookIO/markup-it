import { Record, List, Map, Set } from 'immutable';
import { Text, Block, Document } from 'slate';
import BLOCKS from '../constants/blocks';
import RuleFunction from './rule-function';

/*
    State stores the global state when serializing a document or deseriaizing a text.
 */

const DEFAULTS = {
    text: '',
    nodes: List(),
    marks: Set(),
    object: String('document'),
    rulesSet: Map(),
    depth: 0,
    props: Map()
};

class State extends Record(DEFAULTS) {
    /**
     * Create a new state from a set of rules.
     * @param  {Object} rulesSet
     * @param  {Object} props
     * @return {State} state
     */
    static create(rulesSet = {}, props = {}) {
        return new State({
            rulesSet: Map(rulesSet).map(List),
            props: Map(props)
        });
    }

    /**
     * Return list of rules currently being used
     * @return {List} rules
     */
    get rules() {
        const { object, rulesSet } = this;
        return rulesSet.get(object, List());
    }

    /**
     * Change set of rules to use.
     *
     * @param  {String} object
     * @return {State} state
     */
    use(object) {
        return this.merge({ object });
    }

    /**
     * Set a prop for the state.
     *
     * @param  {String} key
     * @param  {Mixed} value
     * @return {State} state
     */
    setProp(key, value) {
        let { props } = this;
        props = props.set(key, value);

        return this.merge({ props });
    }

    /**
     * Get a prop from the state
     *
     * @param  {String} key
     * @param  {Mixed} def
     * @return {Mixed}
     */
    getProp(key, def) {
        const { props } = this;
        return props.get(key, def);
    }

    /**
     * Write a string. This method can be used when serializing nodes into text.
     *
     * @param  {String} string
     * @return {State} state
     */
    write(string) {
        let { text } = this;
        text += string;
        return this.merge({ text });
    }

    /**
     * Replace all the text in the state.
     *
     * @param  {String} text
     * @return {State} state
     */
    replaceText(text) {
        return this.merge({ text });
    }

    /**
     * Peek the first node in the stack
     *
     * @return {Node} node
     */
    peek() {
        return this.nodes.first();
    }

    /**
     * Shift the first node from the stack
     *
     * @return {State} state
     */
    shift() {
        let { nodes } = this;
        nodes = nodes.shift();
        return this.merge({ nodes });
    }

    /**
     * Unshift a node in the list
     *
     * @param  {Node} node
     * @return {State} state
     */
    unshift(node) {
        let { nodes } = this;
        nodes = nodes.unshift(node);
        return this.merge({ nodes });
    }

    /**
     * Push a new node to the stack. This method can be used when deserializing
     * a text into a set of nodes.
     *
     * @param  {Node | List<Node>} node
     * @return {State} state
     */
    push(node) {
        let { nodes } = this;

        if (List.isList(node)) {
            nodes = nodes.concat(node);
        } else {
            nodes = nodes.push(node);
        }

        return this.merge({ nodes });
    }

    /**
     * Push a new mark to the active list
     *
     * @param  {Mark} mark
     * @return {State} state
     */
    pushMark(mark) {
        let { marks } = this;
        marks = marks.add(mark);
        return this.merge({ marks });
    }

    /**
     * Generate a new text container.
     *
     * @param  {String} text
     * @return {Node} text
     */
    genText(text = '') {
        const { marks } = this;

        let node = Text.create({ text, marks });

        if (this.object == 'block') {
            node = Block.create({
                type: BLOCKS.TEXT,
                nodes: [node]
            });
        }

        return node;
    }

    /**
     * Push a new text node.
     *
     * @param  {String} text
     * @return {State} state
     */
    pushText(text) {
        return this.push(this.genText(text));
    }

    /**
     * Move this state to a upper level
     *
     * @param  {Number} string
     * @return {State} state
     */
    up() {
        let { depth } = this;
        depth -= 1;
        return this.merge({ depth });
    }

    /**
     * Move this state to a lower level
     *
     * @param  {Number} string
     * @return {State} state
     */
    down() {
        let { depth } = this;
        depth += 1;
        return this.merge({ depth });
    }

    /**
     * Skip "n" characters in the text.
     * @param  {Number} n
     * @return {State} state
     */
    skip(n) {
        let { text } = this;
        text = text.slice(n);
        return this.merge({ text });
    }

    /**
     * Parse current text buffer
     * @return {State} state
     */
    lex(opts = {}) {
        const state = this;
        const { text } = state;
        const {
            // Non parsed content left in the stack
            rest = '',
            // Should we trim the rest
            trim = true,
            // When should we stop lexing
            stopAt = (newState, prevState) => null
        } = opts;

        let startState = state;
        const trimedRest = trim ? rest.trim() : rest;
        if (trimedRest) {
            startState = startState.pushText(trimedRest);
        }

        // No text to parse, we return
        if (!text) {
            return startState;
        }

        // We apply the rules to find the first matching one
        const newState = startState.applyRules('deserialize');

        // Same state cause an infinite loop
        if (newState == startState) {
            throw new Error(
                'Some rule is returning an identical state (no-op). Make sure your rules either return undefined to pass their turn, or return a different state.'
            );
        }

        // No rules match, we move and try the next char
        if (!newState) {
            return state.skip(1).lex({
                ...opts,
                rest: rest + text[0]
            });
        }

        // Should we stop ?
        const stop = stopAt(newState, state);
        if (stop) {
            return stop;
        }

        // Otherwise we keep parsing
        return newState.lex(opts);
    }

    /**
     * Apply first matching rule
     * @param  {String} text
     * @return {State} state
     */
    applyRules(object) {
        const state = this;
        const { rules } = state;
        let newState;

        rules.filter(rule => rule[object]).forEach(rule => {
            newState = RuleFunction.exec(rule[object], state);
            return !newState;
        });

        return newState;
    }

    /**
     * Deserialize a text into a Node.
     * @param  {String} text
     * @return {List<Node>} nodes
     */
    deserialize(text) {
        const state = this.down()
            .merge({ text, nodes: List() })
            .lex();

        return state.nodes;
    }

    /**
     * Deserialize a string content into a Document.
     * @param  {String} text
     * @return {Document} document
     */
    deserializeToDocument(text) {
        const document =
            this.use('document')
                .deserialize(text)
                .get(0) || Document.create();

        let { nodes } = document;

        // We should never return an empty document
        if (nodes.size === 0) {
            nodes = nodes.push(
                Block.create({
                    type: BLOCKS.PARAGRAPH,
                    nodes: [Text.create()]
                })
            );
        }

        return document.merge({ nodes });
    }

    /**
     * Serialize nodes into text
     * @param  {List<Node>} nodes
     * @return {String} text
     */
    serialize(nodes) {
        return this.down()
            .merge({
                text: '',
                nodes: List(nodes)
            })
            ._serialize().text;
    }

    /**
     * Serialize a document into text
     * @param  {Document} document
     * @return {String} text
     */
    serializeDocument(document) {
        return this.use('document').serialize([document]);
    }

    /**
     * Serialize a node into text
     * @param  {Node} node
     * @return {String} text
     */
    serializeNode(node) {
        return this.serialize([node]);
    }

    /**
     * Update the state to serialize it.
     * @return {State} state
     */
    _serialize() {
        let state = this;

        if (state.nodes.size == 0) {
            return state;
        }

        state = state.applyRules('serialize');

        // No rule can match this node
        if (!state) {
            throw new Error(
                `No rule match node ${this.peek().object}#${this.peek().type ||
                    ''}`
            );
        }

        // Same state cause an infinite loop
        if (state == this) {
            throw new Error(
                'A rule returns an identical state, returns undefined instead when passing.'
            );
        }

        return state._serialize();
    }
}

export default State;
