import React from "react";
import { Switch, Route, Link } from 'react-router-dom'
import Hotel from './Hotel.jsx';
import Search from './Search.jsx';

export default class App extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(
        <div>
          <h1>Setup</h1>
          <Link to="/hotel">Hotel</Link>
          <Link to="/search">Search</Link>
          <Switch>
            <Route path='/hotel' component={Hotel}/>
            <Route path='/search' component={Search}/>
          </Switch>
        </div>
      );
    }
  }