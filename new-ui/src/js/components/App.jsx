import React from "react";
import { Switch, Route, Link } from 'react-router-dom'
import Hotels from './Hotels.jsx';
import Search from './Search.jsx';
import Footer from './Footer.jsx';
import Nav from './Nav.jsx';

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
          isAuthenticated : false
        }
        this.setAuthenticate = this.setAuthenticate.bind(this);
	}
	
	setAuthenticate(e){
		this.setState({
			isAuthenticated : e
		});
	}

    render() {
      return(
          <div className="container">
            <Nav setAuthenticate={this.setAuthenticate}/>
            <Switch>
              <Route exact path='/' render={(props) => <Hotels isAuthenticated={this.state.isAuthenticated} {...props} />} />
              <Route exact path='/search' component={Search}/>
            </Switch>
          </div>
      );
    }
  }
