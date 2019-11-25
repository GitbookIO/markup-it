/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <paragraph>
            <html
                closingTag="</p>"
                innerHtml="Hello <a href=&quot;https://www.google.com&quot;>World</a> !"
                openingTag="<p>"
            />
        </paragraph>
    </document>
);
