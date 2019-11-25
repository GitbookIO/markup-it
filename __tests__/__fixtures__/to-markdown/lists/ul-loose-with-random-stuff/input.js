/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>One paragraph before</paragraph>
        <unordered_list>
            <list_item>
                <paragraph>Contains a table</paragraph>
                <table aligns={['right', null]}>
                    <table_row>
                        <table_cell>
                            <paragraph>A</paragraph>
                        </table_cell>
                        <table_cell>
                            <paragraph>B</paragraph>
                        </table_cell>
                    </table_row>
                    <table_row>
                        <table_cell>
                            <paragraph>A1</paragraph>
                        </table_cell>
                        <table_cell>
                            <paragraph>B1</paragraph>
                        </table_cell>
                    </table_row>
                    <table_row>
                        <table_cell>
                            <paragraph>A2</paragraph>
                        </table_cell>
                        <table_cell>
                            <paragraph>B2</paragraph>
                        </table_cell>
                    </table_row>
                </table>
            </list_item>
            <list_item>
                <paragraph>Contains a code block</paragraph>
                <code_block>
                    <code_line>Some code</code_line>
                </code_block>
            </list_item>
            <list_item>
                <unstyled>Contains nested list</unstyled>
                <unordered_list>
                    <list_item>
                        <unstyled>Sub</unstyled>
                        <unordered_list>
                            <list_item>
                                <unstyled>Sub sub</unstyled>
                            </list_item>
                        </unordered_list>
                    </list_item>
                </unordered_list>
            </list_item>
            <list_item>
                <paragraph>Contains a blockquote</paragraph>
                <blockquote>
                    <paragraph>Hello World</paragraph>
                </blockquote>
            </list_item>
        </unordered_list>
        <paragraph>One paragraph after</paragraph>
    </document>
);
