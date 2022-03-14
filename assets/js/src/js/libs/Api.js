import { API_ROOT } from '../api-config';
import axios from 'axios';
import Cookies from 'universal-cookie';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const API = {

    getRoom : (component) => {
        axios.get(API_ROOT + '/room/')
			.then(res => {
				component.setState({rooms : res.data.rooms});
			});
    },

    getRoomById : (component) => {
        axios.get(API_ROOT + '/room/' + component.props.params.id, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => {
            res.data.featuresObject = component.state.room.featuresObject;

            for (let i = 0; i < res.features.length; i++) {
                res.data.featuresObject[res.features[i]] = true
            }

            component.setState({ room : res.data });
        });
    },

    postRoom : (component) => {
        axios.post(API_ROOT + '/room/', 
        JSON.stringify(component.state.newRoom),
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 201){
                component.resetForm();
                component.props.updateRooms();
            } else {
                return res.data;
            }
        })
        .then(res => {
            if(res){
                component.setState({ errors : res.fieldErrors });
            }
        });
    },

    putRoom : (component) => {
        axios.put(API_ROOT + '/room/' + component.props.params.id,
            JSON.stringify(component.state.room),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            .then(res => {
                if(res.status == 202){
                    component.resetForm();
                    component.fetchRoomDetails();
                } else {
                    return res.data;
                }
            })
            .then(res => {
                if(res){
                    component.setState({ errors : res.fieldErrors });
                }
            });
    },

    postBooking : (component) => {
        axios.post(API_ROOT + '/booking/',
            component.state.booking,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            .then(res => {
                if (res.status == 201){
                    component.setState({completed : true})
                } else {
                    return res.data;
                }
            })
            .catch(res => {
                if (res.status == 409){
                    component.setState({ errors : ["The room dates are either invalid or are already booked for one or more of the dates that you have selected."]})
                } else {
                    component.setState({ errors : res.response.data.fieldErrors });
                }
            });
    },

    getBranding : (component) => {
        axios.get(API_ROOT + '/branding/', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.data)
        .then(res => {
            component.setState({ branding : res });
        });
    },

    putBranding : (component) => {
        axios.put(API_ROOT + '/branding/',
            JSON.stringify(component.state.branding),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(res => {
                if(res.status == 202){
                    component.setState({showModal : true, errors : {}});
                }
            })
            .catch(res => {
                component.setState({ errors : res.response.data.fieldErrors });
            })
    },
    

    getRoomReport : (component) => {
        axios.get(API_ROOT + '/report/room/' + component.props.roomid, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            component.setState({ events : res.data.report });
        })
    },

    getReport : (component) => {
        axios.get(API_ROOT + '/report/')
            .then(body => {
                component.setState({ report : body.data.report });
            });
    },

    getNotificationCount : (component) => {
        axios.get(API_ROOT + '/message/count', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            component.setState({ count : res.data.count });
        })
    },

    getMessages : (component) => {
        axios.get(API_ROOT + '/message/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            component.setState({ messages : res.data.messages });
        })
    },

    deleteMessage : (id, component) => {
        axios.delete(API_ROOT + '/message/' + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            component.refreshMessageList();
        })
    },

    getMessage : (id, component) => {
        axios.get(API_ROOT + '/message/' + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            component.setState(res.data);
        })
    },

    postMessage : (component) => {
        axios.post(API_ROOT + '/message/',
            JSON.stringify(component.state.contact),{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 201){
                component.setState({ submitted : true});
            }
        })
        .catch(res => {
            component.setState({ errors : res.response.data.fieldErrors });
        });
    },

    putMessageRead :  (id) => {
        axios.put(API_ROOT + '/message/' + id + '/read', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
    },

    postLogout : (component, tokenCookie) => {
        axios.post(API_ROOT + '/auth/logout',
            JSON.stringify({ 'token' : tokenCookie }),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
		})
		.then(res => {
			if(res.status == 200){
				component.props.setAuthenticate(false);

				const cookies = new Cookies();
				cookies.remove('token');
			}
		})
    },

    postValidation : (component, cookies) => {
        axios.post(API_ROOT + '/auth/validate',
            JSON.stringify({ token: cookies.get('token')}),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(res.status == 200){
                    component.setAuthenticate(true);
                }
            })
    },

    deleteBooking : (component) => {
        axios.delete(API_ROOT + '/booking/' + component.props.booking.bookingid, {
			credentials: 'include',
        })
        .then(res => {
            if(res.status == 202){
                component.props.getBookings();
            }
        })
        .catch(e => console.log(e))
    },

    updateBooking : (component) => {
        axios.put(API_ROOT + '/booking/' + component.props.booking.bookingid,
            JSON.stringify(component.state.booking),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(res => {
                component.setState({allowEdit : false});
                component.props.getBookings();
            })
            .catch(e => console.log(e));
    },

    postLogin : (component) => {
        axios.post(API_ROOT + '/auth/login',
            JSON.stringify({
                username: component.state.username,
                password: component.state.password,
            }), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status === 200){
                component.props.setAuthenticate(true);
            } else {
                component.setState({ error : true });
            }
        })
        .catch(e => {
          console.log("Failed to authenticate");
          console.log(e);
        })
    },

    getBookingsByRoomId : (component) => {
        axios.get(API_ROOT + '/booking/?roomid=' + component.props.roomid, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => {
            component.setState(res.data);
        })
        .catch(e => console.log(e));
    },

    deleteAll : (component) => {
        axios.get(API_ROOT + '/booking/?roomid=' + component.props.details.roomid, {
            method: 'GET'
        })
        .then(res => {
            for(let i = 0; i < res.data.bookings.length; i++){
                axios.delete(API_ROOT + '/booking/' + res.data.bookings[i].bookingid);
            }

            axios.delete(API_ROOT + '/room/' + component.props.details.roomid, {
                credentials: 'include'
            })
            .then(res => {
                if(res.status == 202){
                    component.props.updateRooms();
                }
            });
        })
    }

}
