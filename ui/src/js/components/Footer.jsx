import React from "react";

export default class Footer extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(<footer className="footer">
                <div className="container">
                    <p className="text-muted">restful-booker-platform v1.0 - Created by Mark Winteringham - &copy; 2016</p>
                </div>
            </footer>);
    }
  }