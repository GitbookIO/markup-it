/** @jsx h */
import h from '../../../../hyperscript';

export default (
    <document>
        <paragraph>
            world <inline type="math" isVoid data={{ formula: 'a = b' }} />
        </paragraph>
    </document>
);
