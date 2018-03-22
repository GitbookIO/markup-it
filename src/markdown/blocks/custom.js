const { List } = require('immutable');
const trimTrailingLines = require('trim-trailing-lines');
const { Serializer, Deserializer, Block } = require('../../');
const reBlock = require('../re/block');
const liquid = require('../liquid');

/**
 * Return true if a block type is a custom one.
 * @param  {String} tag
 * @return {Boolean}
 */
function isCustomType(type) {
    return type.indexOf('x-') === 0;
}

/**
 * Return liquid tag from a custom type.
 * @param  {String} type
 * @return {String} tag
 */
function getTagFromCustomType(type) {
    return type.slice(2);
}

/**
 * Return custom type from a liquid tag.
 * @param  {String} tag
 * @return {String} type
 */
function getCustomTypeFromTag(tag) {
    return `x-${tag}`;
}

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
    .matchType(isCustomType)
    .then((state) => {
        const node = state.peek();
        const { type, data } = node;

        const startTag = liquid.stringifyTag({
            tag: getTagFromCustomType(type),
            data
        });

        const unendingTags = state.getProp('unendingTags') || List();
        const endTag =
            unendingTags.includes(getTagFromCustomType(node.type))
                ? ''
                : liquid.stringifyTag({
                    tag: 'end' + getTagFromCustomType(node.type)
                });

        const split = node.object == 'block' ? '\n' : '';
        const end = node.object == 'block' ? '\n\n' : '';

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
    .matchRegExp(reBlock.customBlock, (state, match) => {
        if (state.getProp('template') === false) {
            return;
        }

        const text = match[1].trim();
        const { tag, data } = liquid.parseTag(text);

        const node = Block.create({
            type: getCustomTypeFromTag(tag),
            data,
            isVoid: true,
            nodes: List([ state.genText() ])
        });

        // This node is temporary
        if (isClosingTag(tag)) {
            return state.push(node);
        }

        // By default it'll add this node as a single node.
        state = state.push(node);

        // List of tags that don't have an end
        const unendingTags = state.getProp('unendingTags') || List();

        const resultState = state.lex({
            stopAt(newState) {
                // What nodes have been added in this iteration?
                const added = newState.nodes.skip(state.nodes.size);
                const between = added.takeUntil(child => {
                    // Some tags don't have an explicit end and thus
                    // need a special treatment
                    if (unendingTags.includes(tag)) {
                        return (
                            isCustomType(child.type) &&
                            (
                                // Closing custom tag close previous unending tags
                                isClosingTag(getTagFromCustomType(child.type)) ||
                                // Unending tag close previous unending tags
                                unendingTags.includes(getTagFromCustomType(child.type))
                            )
                        );
                    }

                    return (
                        isCustomType(child.type) &&
                        isClosingTagFor(
                            getTagFromCustomType(child.type),
                            tag
                        )
                    );
                });

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
                        // Filter out this node's closing tag
                        .filterNot((child) => (
                            isCustomType(child.type) &&
                            isClosingTag(getTagFromCustomType(child.type)) &&
                            // Don't swallow others' closing node by ensuring
                            // we filter the one that matches the current one
                            isClosingTagFor(
                                getTagFromCustomType(child.type),
                                tag
                            )
                        ))
                });
            }
        });

        return resultState;
    });

module.exports = { serialize, deserialize };
