/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>Hello world</paragraph>
        <block
            type="x-youtube"
            isVoid
            data={{ src: 'https://www.youtube.com/watch?v=XXXXXXX' }}
        />
    </document>
);
