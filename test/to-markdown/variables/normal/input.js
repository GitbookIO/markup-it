/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>
            Hello <inline type="variable" isVoid data={{ key: 'name' }} />
        </paragraph>
    </document>
);
