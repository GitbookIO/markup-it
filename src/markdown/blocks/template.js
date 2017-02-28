const { List } = require('immutable');
const trimTrailingLines = require('trim-trailing-lines');
const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');
const liquid = require('../../liquid');

/**
 * Return true if a type if the closing tag.
 * @param  {String} tag
 * @return {Boolean}
 */
function isClosingTag(tag) {
    return tag.indexOf('end') === 0;
}

/**
 * Return true if a type if the closing tag of another type
 * @param  {String} type
 * @return {Boolean}
 */
function isClosingTagFor(tag, forTag) {
    return tag.indexOf(`end${forTag}`) === 0;
}

/**
 * Serialize a templating block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TEMPLATE_BLOCK)
    .then((state) => {
        const node = state.peek();
        const { data } = node;
        const tag = data.get('tag');
        const props = data.get('props');

        const startTag = liquid.stringifyTag({ tag, props });
        const endTag = liquid.stringifyTag({ tag: `end${tag}` });
        const split = node.kind == 'block' ? '\n' : '';
        const end = node.kind == 'block' ? '\n\n' : '';

        if (node.isVoid) {
            return state
                .shift()
                .write(`${startTag}${end}`);
        }

        const inner = trimTrailingLines(state.serialize(node.nodes));

        return state
            .shift()
            .write(`${startTag}${split}${inner}${split}${endTag}${end}`);
    });

/**
 * Deserialize a templating block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.templateBlock, (state, match) => {
        if (state.getProp('template') === false) {
            return;
        }

        const text = match[1].trim();
        const tagData = liquid.parseTag(text);

        const node = Block.create({
            type: BLOCKS.TEMPLATE_BLOCK,
            data: tagData,
            isVoid: true,
            nodes: List([ state.genText() ])
        });

        // This node is temporary
        if (isClosingTag(tagData.tag)) {
            return state.push(node);
        }

        // By default it'll add this node as a single node.
        state = state.push(node);

        const resultState = state.lex({
            stopAt(newState) {
                // What nodes have been added in this iteration?
                const added = newState.nodes.skip(state.nodes.size);

                const between = added.takeUntil(child => (
                    child.type == BLOCKS.TEMPLATE_BLOCK &&
                    isClosingTagFor(child.data.get('tag'), tagData.tag)
                ));

                if (between.size == added.size) {
                    return;
                }

                // We skip the default node.
                const beforeNodes = state.nodes.butLast();
                const afterNodes = added.skip(between.size);

                return newState.merge({
                    nodes: beforeNodes
                        .push(node.merge({
                            isVoid: false,
                            nodes: between.size == 0 ? List([ state.genText() ]) : between
                        }))
                        .concat(afterNodes)
                        .filterNot((child) => (
                            child.type == BLOCKS.TEMPLATE_BLOCK &&
                            isClosingTag(child.data.get('tag'))
                        ))
                });
            }
        });

        return resultState;
    });

module.exports = { serialize, deserialize };