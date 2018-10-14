import React from "react";
import { Link } from 'react-router-dom';

export default class Footer extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(
            <footer id="footer" className="footer">
                <div className="container">
                    <p className="text-muted">restful-booker-platform v3.0 - Created by <a href="http://www.mwtestconsultancy.co.uk">Mark Winteringham</a> - &copy; 2018 <Link to={'/cookiepolicy'}>Cookie-Policy</Link> <span style={{float : "right"}}>Learn more about <a href="https://automationintesting.com" alt="Automation in testing site">Automation in Testing</a> here</span></p>
                </div>
            </footer>);
    }
  }