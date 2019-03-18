import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom'
import { API_ROOT } from '../api-config';
import Cookies from 'universal-cookie';

import Nav from './Nav.jsx';
import Login from './Login.jsx'
import Report from './Report.jsx';
import Loading from './Loading.jsx';
import Branding from './Branding.jsx';

const RoomListings = React.lazy(() => import('./RoomListings.jsx'));
const RoomDetails = React.lazy(() => import('./RoomDetails.jsx'));

export default class AdminContainer extends React.Component {

    constructor(){
        super();

        this.state = {
            isAuthenticated : false,
        }
        
        this.setAuthenticate = this.setAuthenticate.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

        fetch(API_ROOT.auth + '/validate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({ token: cookies.get('token')})
            })
            .then(res => {
                if(res.status == 200){
                    this.setAuthenticate(true);
                }
            })
    }
    
    setAuthenticate(e){
        this.setState({
            isAuthenticated : e,
            showWelcome : this.state.showWelcome
        });
    }
    
    render(){
        return(<div>
            <Nav setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated} />
            <div className="container">
                <div>
                    {this.state.isAuthenticated ? (
                        <div>
                            <Route exact path='/admin/' render={(props) => (
                                <div>
                                    <Suspense fallback={<Loading />}>
                                        <RoomListings {...props} />
                                    </Suspense>
                                </div>
                            )} />
                            <Route exact path='/admin/room/:id' render={({ location, match }) => (
                                <div>
                                    <Suspense fallback={<Loading />}>
                                        <RoomDetails params={match.params}/>
                                    </Suspense>
                                </div>
                            )} />
                            <Route exact path='/admin/report' component={Report} />
                            <Route exact path='/admin/branding' component={Branding} />
                        </div>
                    ) : (
                        <div>
                            <Login setAuthenticate={this.setAuthenticate} />
                        </div>
                    )}
                </div>
            </div>
        </div>)
    }

}