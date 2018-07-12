import React from "react";

export default class Footer extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(<footer className="footer">
                <div className="container">
                    <p className="text-muted">restful-booker-platform v3.0 - Created by <a href="http://www.mwtestconsultancy.co.uk">Mark Winteringham</a> - &copy; 2018</p>
                </div>
            </footer>);
    }
  }