/** @jsx h */
import h from 'h';

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
