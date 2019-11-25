/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <table aligns={[null, null]}>
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
                    <unordered_list>
                        <list_item>
                            <unstyled>Hello</unstyled>
                        </list_item>
                        <list_item>
                            <unstyled>World</unstyled>
                        </list_item>
                    </unordered_list>
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
    </document>
);
