/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>Hello World</paragraph>
        <x-tabs>
            <x-tab title="First Tab">
                <blockquote>
                    <paragraph>This is a blockquote</paragraph>
                </blockquote>
            </x-tab>
            <x-tab title="Second Tab">
                <unordered_list>
                    <list_item>
                        <unstyled>Item 1</unstyled>
                    </list_item>
                    <list_item>
                        <unstyled>Item 2</unstyled>
                    </list_item>
                </unordered_list>
            </x-tab>
        </x-tabs>
    </document>
);
