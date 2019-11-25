/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <ordered_list>
            <list_item>
                <paragraph>{"Here's some code:"}</paragraph>
                <code_block>
                    <code_line>{'const foo = {'}</code_line>
                    <code_line>{"    [bar]: 'bar'"}</code_line>
                    <code_line>{'};'}</code_line>
                </code_block>
            </list_item>
        </ordered_list>
    </document>
);
