/** @jsx h */
import h from 'h';

export default (
    <document>
        <header_one>Introduction</header_one>
        <paragraph>First page. And last one too.</paragraph>
        <x-tabs>
            <x-tab title="First Tab">
                <paragraph>Here is some content.</paragraph>
                <unordered_list>
                    <list_item>
                        <unstyled>Item 1</unstyled>
                    </list_item>
                    <list_item>
                        <unstyled>Item 2</unstyled>
                    </list_item>
                </unordered_list>
            </x-tab>
            <x-tab title="Second Tab">
                <paragraph>Something else here.</paragraph>
            </x-tab>
        </x-tabs>
    </document>
);
