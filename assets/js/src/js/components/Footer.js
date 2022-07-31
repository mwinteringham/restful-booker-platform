import React from "react";
import Package from '../../../package.json';

const Footer = () => {
    
    return(
        <footer id="footer" className="footer">
            <div className="container">
                <p className="text-muted">restful-booker-platform v{Package.version} Created by <a href="http://www.mwtestconsultancy.co.uk">Mark Winteringham</a> / <a href="https://thefriendlytester.co.uk/">Richard Bradshaw</a> - &copy; 2019-22 <a href={'/#/cookie'}>Cookie-Policy</a> - <a href={'/#/privacy'}>Privacy-Policy</a> - <a href={'/#/admin'}>Admin panel</a> <span style={{float : "right"}}>Learn more about <a href="https://automationintesting.com" alt="Automation in testing site">Automation in Testing</a></span></p>
            </div>
        </footer>
    )
    
}

export default Footer;