/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            The empty line before endyoutube should not create a separate
            paragraph
        </paragraph>
        <x-youtube>
            <paragraph>The Content</paragraph>
        </x-youtube>
    </document>
);
