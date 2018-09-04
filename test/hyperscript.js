const {createHyperscript} = require('slate-hyperscript');

// Hyperscript function used to convert the JSX syntax
// in tests to Slate models `create` calls.
const h = createHyperscript({
    blocks: {
        blockquote: 'blockquote',
        code_line: 'code_line',
        paragraph: 'paragraph',
        default: 'default'
    },
    inlines: {
        link: 'link',
        'unknown-inline': 'unknown-inline'
    },
    marks: {
        italic: 'italic'
    }
});

module.exports = h;
