/** @jsx h */
import h from '../../hyperscript';

export default (
    <document>
        <code_block>
            <code_line>foreach (Employee emp in result)</code_line>
            <code_line>{'{'}</code_line>
            <code_line>
                {'  Console.WriteLine(emp.FirstName + " " + emp.LastName);'}
            </code_line>
            <code_line>{'}'}</code_line>
        </code_block>
    </document>
);
