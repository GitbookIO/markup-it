/** @jsx h */
import h from 'h';

// The <span> tag is deleted here because it is considered as a
// self-closing tag and is stripped out since it contains no content
export default (
    <document>
        <paragraph>Test regexp to not catch non-html</paragraph>
        <paragraph>{'<div<NOT HTML</div>'}</paragraph>
        <paragraph>{'NOT HTML EITHER</div>'}</paragraph>
        <paragraph>TRUE HTML</paragraph>
    </document>
);
