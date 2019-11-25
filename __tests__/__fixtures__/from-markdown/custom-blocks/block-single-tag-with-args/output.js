/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <block type="x-import" isVoid data={{ 0: 'hello.md' }} />
        <paragraph>After the import</paragraph>
    </document>
);
