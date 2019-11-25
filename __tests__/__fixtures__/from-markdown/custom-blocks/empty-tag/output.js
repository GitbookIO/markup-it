/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>A</paragraph>
        <paragraph>B</paragraph>
        <paragraph>C</paragraph>
        <paragraph>{'{% This one is parsed as a paragraph %}'}</paragraph>
    </document>
);
