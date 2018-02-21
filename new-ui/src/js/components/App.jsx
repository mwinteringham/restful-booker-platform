import React from "react";
import { Switch, Route, Link } from 'react-router-dom'
import Hotels from './Hotels.jsx';
import Search from './Search.jsx';
import Footer from './Footer.jsx';
import Nav from './Nav.jsx';

export default class App extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(
          <div className="container">
            <Nav />
            <Switch>
              <Route exact path='/' component={Hotels} />
              <Route exact path='/search' component={Search}/>
            </Switch>
          </div>
      );
    }
  }
