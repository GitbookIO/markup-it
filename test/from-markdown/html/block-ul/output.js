/** @jsx h */
import h from 'h';

export default (
    <document>
        <html_block html={'<ol>\n<li>test</li>\n</ol>'} />
        <paragraph>Hello</paragraph>
        <html_block html={'<ol>\n    <li>test</li>\n</ol>'} />
        <paragraph>World</paragraph>
    </document>
);
