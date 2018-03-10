import React from 'react';
import { Route, Switch } from 'react-router-dom'
import HotelListings from './HotelListings.jsx';
import Search from './Search.jsx';
import Footer from './Footer.jsx';
import Nav from './Nav.jsx';
import HotelDetails from './HotelDetails.jsx';
import Report from './Report.jsx';
import Cookies from 'universal-cookie';

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
          isAuthenticated : false
		}
		
        this.setAuthenticate = this.setAuthenticate.bind(this);
	}

	componentDidMount(){
		const cookies = new Cookies();

		fetch('http://' + window.location.hostname + ':3004/validate', {
				method: 'POST',
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
				body : JSON.stringify({ token: cookies.get('token')})
			})
			.then(res => {
				if(res.status == 200){
					this.setState({isAuthenticated: true});
				}
			})
	}
	
	setAuthenticate(e){
		this.setState({
			isAuthenticated : e
		});
	}

    render() {
      return(
          <div className="container">
            <Nav setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated} />
            <Switch>
				<Route exact path='/' render={(props) => <HotelListings isAuthenticated={this.state.isAuthenticated} {...props} />} />
				<Route exact path='/search' component={Search} {...this.props}/>
				<Route exact path='/hotel/:id' render={({ location, match }) => (
						<HotelDetails isAuthenticated={this.state.isAuthenticated} params={match.params}/>
				)} />
				<Route exact path='/report' component={Report} />
            </Switch>
          </div>
      );
    }
  }
