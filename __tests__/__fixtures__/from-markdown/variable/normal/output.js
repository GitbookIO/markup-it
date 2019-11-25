/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            Hello <inline type="variable" isVoid data={{ key: 'name' }} />
        </paragraph>
    </document>
);
