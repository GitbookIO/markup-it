/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>
            This paragraph is followed by a table, without any blank line
            in-between.
        </paragraph>
        <table aligns={[null, null]}>
            <table_row>
                <table_cell>A</table_cell>
                <table_cell>B</table_cell>
            </table_row>
            <table_row>
                <table_cell>A1</table_cell>
                <table_cell>B1</table_cell>
            </table_row>
            <table_row>
                <table_cell>A2</table_cell>
                <table_cell>B2</table_cell>
            </table_row>
        </table>
    </document>
);
