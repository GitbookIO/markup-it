/** @jsx h */
import h from 'h';

export default (
    <document>
        <unordered_list>
            <list_item checked={false}>
                <unstyled>Hello</unstyled>
            </list_item>
            <list_item checked>
                <unstyled>World</unstyled>
                <unordered_list>
                    <list_item>
                        <unstyled>Inner 1</unstyled>
                    </list_item>
                    <list_item>
                        <unstyled>Inner 2</unstyled>
                    </list_item>
                </unordered_list>
            </list_item>
        </unordered_list>
    </document>
);
