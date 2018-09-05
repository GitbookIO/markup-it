/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <block type="x-someblock" isVoid data={{ message: 'Hello "world"' }} />
    </document>
);
