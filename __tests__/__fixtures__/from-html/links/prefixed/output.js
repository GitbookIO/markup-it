/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            {' '}
            This is a a link{' '}
            <link href="image.com/image.png" title="Image title">
                Image text
            </link>
            <text />
        </paragraph>
    </document>
);
