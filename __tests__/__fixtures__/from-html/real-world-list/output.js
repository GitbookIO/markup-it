/** @jsx h */
import h from '../../hyperscript';

export default (
    <document>
        <paragraph>
            Let’s see how the account management is organized:
        </paragraph>
        <unordered_list>
            <list_item>
                <unstyled>
                    An <bold>Account</bold> is what you use to login to Algolia.
                    Each team member should have a separate account, secured
                    with Two-Factor-Authentication.
                </unstyled>
            </list_item>
            <list_item>
                <unstyled>
                    Each team member can have access to one or multiple{' '}
                    <bold>Applications</bold>. You can invite members to the
                    applications you manage.
                </unstyled>
            </list_item>
        </unordered_list>
    </document>
);
