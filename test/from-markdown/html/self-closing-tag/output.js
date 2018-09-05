/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>
            <inline
                type="html"
                isVoid
                data={{
                    closingTag: '',
                    innerHtml: '',
                    openingTag: '<br/>'
                }}
            />
        </paragraph>
    </document>
);
