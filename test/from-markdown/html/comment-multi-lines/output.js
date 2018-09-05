/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>This is a paragraph followed by an HTML comment.</paragraph>
        <html_block
            html={
                '<!-- This is a\n# multi-line comment\n## starting with heading -->'
            }
        />
        <paragraph>And here goes another paragraph.</paragraph>
    </document>
);
