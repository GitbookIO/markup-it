import { createHyperscript } from 'slate-hyperscript';
import { BLOCKS, INLINES, MARKS, VOID } from '../src';

/*
 * Return an mapping from type to type
 */
function typesToObject(types) {
    return Object.keys(types).reduce((acc, key) => {
        const type = types[key];
        return {
            [type.toLowerCase()]: {
                type,
                isVoid: VOID[type]
            },
            ...acc
        };
    }, {});
}

// Hyperscript function used to convert the JSX syntax
// in tests to Slate models `create` calls.
const h = createHyperscript({
    blocks: {
        ...typesToObject(BLOCKS)
    },
    inlines: {
        ...typesToObject(INLINES)
    },
    marks: {
        ...typesToObject(MARKS)
    }
});

export default h;
