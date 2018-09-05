/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>A</paragraph>
        <paragraph>B</paragraph>
        <paragraph>C</paragraph>
        <paragraph>{'{% This one is parsed as a paragraph %}'}</paragraph>
    </document>
);
