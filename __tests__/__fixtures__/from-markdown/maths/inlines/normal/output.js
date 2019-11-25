/** @jsx h */
import h from '../../../../hyperscript';

export default (
    <document>
        <paragraph>
            Hello <inline type="math" isVoid data={{ formula: 'a = b' }} />{' '}
            world
        </paragraph>
    </document>
);
