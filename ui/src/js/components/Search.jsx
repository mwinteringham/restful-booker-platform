import React from 'react';
import { Link } from 'react-router-dom';

export default class Search extends React.Component {

    constructor() {
        super();

        this.state = {
          bookings : [],
		  query : ""
		}
		
		this.doSearch = this.doSearch.bind(this);
    }

    componentDidMount() {
		this.doSearch()
	}
	
	componentDidUpdate() {
		if(this.state.query != this.props.location.search){
			this.doSearch();
		}
	}

	doSearch() {
		fetch('http://' + window.location.hostname + ':3002/search' + this.props.location.search, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(res => {
			if(res.bookings){
				this.setState({bookings : res.bookings})
			} else {
				this.setState({bookings : []})
			}
			
			this.setState({query : this.props.location.search})
		});
	}

    render() {
    	return(
			<div>
				<div className="row">
					<div className="col-sm-12">
						<div className="well"><h2>Search results</h2></div>
					</div>
				</div>
				<div className="row">
                    <div className="col-sm-12">
                    	<h3>Booking Results</h3>
                    </div>
                </div>
				{this.state.bookings.map((booking, index) => {
					return <div className="row detail searchResult" key={"booking-search-" + index}>
								<Link to={"/room/" + booking.roomid}>
									<div className="col-sm-8"><p>{booking.firstname} {booking.lastname}</p></div>
									<div className="col-sm-2" style={{textAlign: 'center'}}><p>{booking.bookingdates.checkin.split('T')[0]}</p></div>
									<div className="col-sm-2" style={{textAlign: 'center'}}><p>{booking.bookingdates.checkout.split('T')[0]}</p></div>
								</Link>
							</div>
				})}
			</div>
		);
    }
  }