/** @jsx h */
import h from '../../hyperscript';

export default (
    <document>
        <unordered_list>
            <list_item>
                <unstyled>first item</unstyled>
            </list_item>
            <list_item>
                <unstyled>second item</unstyled>
                <ordered_list>
                    <list_item>
                        <unstyled>second item first subitem</unstyled>
                    </list_item>
                    <list_item>
                        <unstyled>second item second subitem</unstyled>
                        <unordered_list>
                            <list_item>
                                <unstyled>
                                    second item second subitem first sub-subitem
                                </unstyled>
                            </list_item>
                            <list_item>
                                <unstyled>
                                    second item second subitem second
                                    sub-subitem
                                </unstyled>
                            </list_item>
                            <list_item>
                                <unstyled>
                                    second item second subitem third sub-subitem
                                </unstyled>
                            </list_item>
                        </unordered_list>
                    </list_item>
                    <list_item>
                        <unstyled>second item third subitem</unstyled>
                    </list_item>
                </ordered_list>
            </list_item>
            <list_item>
                <unstyled>third item</unstyled>
            </list_item>
        </unordered_list>
    </document>
);
