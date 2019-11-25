/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>Content preceding a method</paragraph>
        <x-method>
            <paragraph>Method content</paragraph>
            <x-sample lang="js">
                <paragraph>Some JS:</paragraph>
                <code_block>
                    <code_line>{"const a = 'hello';"}</code_line>
                </code_block>
                <x-hint>
                    <paragraph>Always use const</paragraph>
                </x-hint>
            </x-sample>
            <x-sample lang="py">
                <paragraph>Some Python:</paragraph>
                <code_block>
                    <code_line>{'a = "hello"'}</code_line>
                </code_block>
            </x-sample>
            <x-common>
                <paragraph>Some PHP:</paragraph>
            </x-common>
            <x-sample lang="php">
                <code_block>
                    <code_line>{"$a = 'hello'"}</code_line>
                </code_block>
            </x-sample>
        </x-method>
    </document>
);
