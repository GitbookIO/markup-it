/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <table aligns={[null, null]}>
            <table_row>
                <table_cell>A</table_cell>
                <table_cell>
                    <unordered_list>
                        <list_item>
                            <unstyled>B</unstyled>
                        </list_item>
                        <list_item>
                            <unstyled>B</unstyled>
                        </list_item>
                    </unordered_list>
                </table_cell>
            </table_row>
            <table_row>
                <table_cell>
                    <unordered_list>
                        <list_item>
                            <paragraph>A1</paragraph>
                        </list_item>
                        <list_item>
                            <paragraph>A1</paragraph>
                        </list_item>
                    </unordered_list>
                </table_cell>
                <table_cell>
                    <paragraph>B1</paragraph>
                </table_cell>
            </table_row>
            <table_row>
                <table_cell>A2</table_cell>
                <table_cell>B2</table_cell>
            </table_row>
        </table>
    </document>
);
