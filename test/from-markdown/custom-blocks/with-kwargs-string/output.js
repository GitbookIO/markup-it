/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <block type="x-someblock" isVoid data={{ a: 'Hello', b: 'World' }} />
    </document>
);
