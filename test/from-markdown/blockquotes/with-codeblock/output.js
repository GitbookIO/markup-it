/** @jsx h */
import h from 'h';

export default (
    <document>
        <blockquote>
            <paragraph>A code block within a blockquote:</paragraph>
            <code_block syntax="js">
                <code_line>{'var a = "test"'}</code_line>
            </code_block>
        </blockquote>
    </document>
);
