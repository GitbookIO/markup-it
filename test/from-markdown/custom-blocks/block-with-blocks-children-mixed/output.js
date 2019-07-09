/** @jsx h */
import h from 'h';

export default (
    <document>
        <header_one>Introduction</header_one>
        <paragraph>First page. And last one too.</paragraph>
        <x-tabs>
            <x-tab title="First Tab">
                <paragraph>Here is some content.</paragraph>
                <blockquote>
                    <paragraph>Is this you I{"'"}m looking for?</paragraph>
                </blockquote>
            </x-tab>
            <x-tab title="Second Tab">
                <paragraph>Something else here.</paragraph>
            </x-tab>
        </x-tabs>
    </document>
);
