import React from "react";

export default class Footer extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(
            <footer id="footer" className="footer">
                <div className="container">
                    <p className="text-muted">restful-booker-platform v1.3 - Created by <a href="http://www.mwtestconsultancy.co.uk">Mark Winteringham</a> / <a href="https://thefriendlytester.co.uk/">Richard Bradshaw</a> - &copy; 2019-20 <a href={'/#/cookie'}>Cookie-Policy</a> - <a href={'/#/privacy'}>Privacy-Policy</a> - <a href={'/#/admin'}>Admin panel</a> <span style={{float : "right"}}>Learn more about <a href="https://automationintesting.com" alt="Automation in testing site">Automation in Testing</a> here</span></p>
                </div>
            </footer>);
    }
  }