import React from "react";
import { Switch, Route, Link } from 'react-router-dom'
import Hotel from './Hotel.jsx';
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
            <Link to="hotel">Hotel</Link>
            <Link to="search">Search</Link>
            <Switch>
              <Route exact path='/hotel' component={Hotel}/>
              <Route exact path='/search' component={Search}/>
            </Switch>
          </div>
      );
    }
  }

  