/** @jsx h */
import h from '../../../../hyperscript';

export default (
    <document>
        <paragraph>Hello</paragraph>
        <block type="math_block" isVoid data={{ formula: 'a = b' }} />
        <paragraph>world</paragraph>
    </document>
);
