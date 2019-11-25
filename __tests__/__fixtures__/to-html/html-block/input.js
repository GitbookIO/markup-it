/** @jsx h */
import h from '../../hyperscript';

export default (
    <document>
        <block
            type="html_block"
            isVoid
            data={{ html: '<ol>\n<li>test</li>\n</ol>' }}
        />
        <paragraph>Hello</paragraph>
        <block
            type="html_block"
            isVoid
            data={{ html: '<ol>\n    <li>test</li>\n</ol>' }}
        />
        <paragraph>World</paragraph>
    </document>
);
