import { createHyperscript } from '@gitbook/slate-hyperscript';
import { BLOCKS, INLINES, MARKS, VOID } from '../src';

function isVoid(type) {
    return VOID[type];
}

/*
 * Return an mapping from type to type
 */
function typesToObject(types) {
    return Object.keys(types).reduce((acc, key) => {
        const type = types[key];
        return {
            [type.toLowerCase()]: {
                type,
                isVoid: isVoid(type)
            },
            ...acc
        };
    }, {});
}

// Hyperscript function used to convert the JSX syntax
// in tests to Slate models `create` calls.
const h = createHyperscript({
    blocks: {
        ...typesToObject(BLOCKS),
        // The following have isVoid false by default.
        // But sometimes they are void, in that case
        // you must write it explicitly in the test.
        'x-youtube': { type: 'x-youtube', isVoid: false },
        'x-embed': { type: 'x-embed', isVoid: false },
        'x-method': { type: 'x-method', isVoid: false },
        'x-sample': { type: 'x-sample', isVoid: false },
        'x-hint': { type: 'x-hint', isVoid: false },
        'x-common': { type: 'x-common', isVoid: false },
        'x-someblock': { type: 'x-someblock', isVoid: false },
        'x-empty': { type: 'x-empty', isVoid: false }
    },
    inlines: {
        ...typesToObject(INLINES)
    },
    marks: {
        ...typesToObject(MARKS)
    }
});

export default h;
