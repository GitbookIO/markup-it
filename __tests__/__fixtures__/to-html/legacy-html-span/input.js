/** @jsx h */
import h from '../../hyperscript';

export default (
    <document>
        <paragraph>
            <html html="<span>" />
            Hello
            <html html="</span>" /> World
        </paragraph>
    </document>
);
