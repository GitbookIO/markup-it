/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            Hello <inline type="footnote-ref" isVoid data={{ id: '1' }} /> world
        </paragraph>
    </document>
);
