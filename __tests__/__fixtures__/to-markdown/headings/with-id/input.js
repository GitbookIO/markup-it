/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <header_one id="mycustomid">Header</header_one>
        <header_one id={'<script>alert("yo")</script>'}>Header</header_one>
    </document>
);
