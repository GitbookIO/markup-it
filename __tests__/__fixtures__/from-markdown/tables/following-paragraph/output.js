/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            This paragraph is followed by a table, without any blank line
            in-between.
        </paragraph>
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
    </document>
);
