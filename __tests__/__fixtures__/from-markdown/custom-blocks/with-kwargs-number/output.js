/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <block type="x-someblock" isVoid data={{ a: 10, b: 30 }} />
    </document>
);
