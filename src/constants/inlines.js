
/**
 * Map of all inline node types. Inline nodes can only contain inline or text nodes.
 * @type {Map}
 */

module.exports = {
    HTML:              'html',
    LINK:              'link',
    IMAGE:             'image',
    FOOTNOTE_REF:      'footnote-ref',
    MATH:              'math',
    // Templating
    TEMPLATE_VARIABLE: 'variable',
    TEMPLATE_INLINE:   'template_inline'
};
