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
        <header_one>Heading</header_one>
    </document>
);
