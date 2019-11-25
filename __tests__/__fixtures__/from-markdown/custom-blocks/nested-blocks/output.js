/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>Hello World</paragraph>
        <x-method>
            <paragraph>Method 1</paragraph>
            <x-sample lang="js">
                <paragraph>Some code</paragraph>
            </x-sample>
        </x-method>
        <x-method>
            <paragraph>Method 2</paragraph>
        </x-method>
    </document>
);
