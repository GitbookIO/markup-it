const BLOCKS = require('./blocks');
const INLINES = require('./inlines');

const VOID = {
    [BLOCKS.HR]:     true,
    [INLINES.IMAGE]: true
};

module.exports = VOID;
