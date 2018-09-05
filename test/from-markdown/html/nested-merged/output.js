/** @jsx h */
import h from 'h';

export default (
    <document>
        <paragraph>
            <html closingTag="</cite>" openingTag="<cite>">
                <html
                    closingTag="</a>"
                    openingTag="<a href=&quot;mylink&quot;>"
                >
                    link
                </html>
            </html>
        </paragraph>
    </document>
);
