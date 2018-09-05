/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <x-method>
            <header_two id="install">Install</header_two>
            <paragraph>
                The first thing is to get the GitBook API client.
            </paragraph>
            <x-sample lang="js">
                <code_block syntax="bash">
                    <code_line>$ npm install gitbook-api</code_line>
                </code_block>
            </x-sample>
            <x-sample lang="go">
                <code_block syntax="bash">
                    <code_line>
                        $ go get github.com/GitbookIO/go-gitbook-api
                    </code_line>
                </code_block>
            </x-sample>
        </x-method>
    </document>
);
