/** @jsx h */
import h from 'h';

export default (
    <document>
        <x-method>
            <header_two>Method 1</header_two>
            <x-sample lang="js">
                <paragraph>JavaScript sample.</paragraph>
            </x-sample>
            <x-sample lang="go">
                <paragraph>Go sample.</paragraph>
            </x-sample>
            <x-common>
                <paragraph>Common content.</paragraph>
            </x-common>
        </x-method>
        <x-method>
            <header_two>Method 2</header_two>
            <x-sample lang="js">
                <paragraph>Yet another JavaScript sample.</paragraph>
            </x-sample>
            <x-common>
                <paragraph>Some more common content.</paragraph>
            </x-common>
        </x-method>
    </document>
);
