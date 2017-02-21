const { List } = require('immutable');
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
        const inner = state.serialize(node.nodes);

        const startTag = liquid.stringifyTag({ tag, props });
        const endTag = liquid.stringifyTag({ tag: `end${tag}` });

        return state
            .shift()
            .write(`${startTag}\n${inner}\n${endTag}\n\n`);
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

        // This node is temporary
        if (isClosingTag(tagData.tag)) {
            const node = Block.create({
                type: BLOCKS.TEMPLATE_BLOCK,
                isVoid: true,
                data: tagData
            });

            return state.push(node);
        }

        const originState = state;
        const resultState = state.lex({
            stopAt(newState) {
                // What nodes have been added in this iteration?
                const added = newState.nodes.skip(originState.nodes.size);

                const between = added.takeUntil(node => (
                    node.type == BLOCKS.TEMPLATE_BLOCK &&
                    isClosingTagFor(node.data.get('tag'), tagData.tag)
                ));

                if (between.size == added.size) {
                    return;
                }

                const beforeNodes = originState.nodes;
                const afterNodes = added.skip(between.size);

                const node = Block.create({
                    type: BLOCKS.TEMPLATE_BLOCK,
                    data: tagData,
                    nodes: between.size == 0 ? List([ state.genText() ]) : between
                });

                return newState.merge({
                    nodes: beforeNodes
                        .push(node)
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
