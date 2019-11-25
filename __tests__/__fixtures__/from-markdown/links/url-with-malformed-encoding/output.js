/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            This is a{' '}
            <link href="https://test.com/hello{%">malformed link</link>
        </paragraph>
    </document>
);
