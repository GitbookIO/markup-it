/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>
            Some image with attributes{' '}
            <inline
                isVoid
                type="html"
                data={{
                    closingTag: '',
                    innerHtml: '',
                    openingTag:
                        '<img src="images/foo.png" alt="foo" width="111" style="margin: 0 auto; display: block">'
                }}
            />
            <text />
        </paragraph>
    </document>
);
