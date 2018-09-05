/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>
            world <inline type="math" isVoid data={{ formula: 'a = b' }} />
        </paragraph>
    </document>
);
