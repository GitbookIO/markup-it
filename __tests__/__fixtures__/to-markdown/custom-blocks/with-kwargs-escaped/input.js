/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <block type="x-someblock" isVoid data={{ message: 'Hello "world"' }} />
    </document>
);
