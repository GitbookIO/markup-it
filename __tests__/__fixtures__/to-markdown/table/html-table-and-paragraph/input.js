/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <table aligns={[null, null]}>
            <table_row>
                <table_cell>
                    <paragraph>A</paragraph>
                    <paragraph>B</paragraph>
                </table_cell>
                <table_cell>
                    <paragraph>{'<C>'}</paragraph>
                </table_cell>
            </table_row>
        </table>
        <paragraph>Some text</paragraph>
    </document>
);
