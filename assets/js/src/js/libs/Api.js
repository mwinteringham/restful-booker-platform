import { API_ROOT } from '../api-config';
import fetch from 'node-fetch';
import Cookies from 'universal-cookie';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const API = {

    getRoom : (component) => {
        fetch(API_ROOT + '/room/')
			.then(res => res.json())
			.then(res => {
				component.setState({rooms : res.rooms});
			});
    },

    postRoom : (component) => {
            fetch(API_ROOT + '/room/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body : JSON.stringify(component.state.newRoom)
            })
            .then(res => {
                if(res.status == 201){
                    component.resetForm();
                    component.props.updateRooms();
                } else {
                    return res.json();
                }
            })
            .then(res => {
                if(res){
                    component.setState({ errors : res.fieldErrors });
                }
            });
    },

    putRoom : (component) => {
        fetch(API_ROOT + '/room/' + component.props.params.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body : JSON.stringify(component.state.room)
        })
        .then(res => {
            if(res.status == 202){
                component.resetForm();
                component.fetchRoomDetails();
            } else {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                component.setState({ errors : res.fieldErrors });
            }
        });
    },

    postBooking : (component) => {
        fetch(API_ROOT + '/booking/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body : JSON.stringify(component.state.booking)
        })
        .then(res => {
            if (res.status == 409){
                component.setState({ errors : ["The room dates are either invalid or are already booked for one or more of the dates that you have selected."]})
            } else if (res.status == 201){
                component.setState({completed : true})
            } else {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                component.setState({ errors : res.fieldErrors });
            }
        });
    },

    getBranding : (component) => {
        fetch(API_ROOT + '/branding/', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            component.setState({ branding : res });
        });
    },

    putBranding : (component) => {
        fetch(API_ROOT + '/branding/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body : JSON.stringify(component.state.branding)
        })
        .then(res => {
            if(res.status == 202){
                component.setState({showModal : true, errors : {}});
            } else if(res.status == 400) {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                component.setState({ errors : res.fieldErrors });
            }
        });
    },

    getRoomReport : (component) => {
        fetch(API_ROOT + '/report/room/' + component.props.roomid, {
            method : 'GET',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            component.setState({ events : res.report });
        })
    },

    getReport : (component) => {
        fetch(API_ROOT + '/report/')
            .then(res => res.json())
            .then(body => {
                component.setState({ report : body.report });
            });
    },

    getNotificationCount : (component) => {
        fetch(API_ROOT + '/message/count', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            component.setState({ count : res.count });
        })
    },

    getMessages : (component) => {
        fetch(API_ROOT + '/message/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            component.setState({ messages : res.messages });
        })
    },

    deleteMessage : (id, component) => {
        fetch(API_ROOT + '/message/' + id, {
            method: 'DELETE',
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
        fetch(API_ROOT + '/message/' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            component.setState(res);
        })
    },

    postMessage : (component) => {
        fetch(API_ROOT + '/message/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body : JSON.stringify(component.state.contact)
        })
        .then(res => {
            if(res.status == 201){
                component.setState({ submitted : true});
            } else if(res.status == 400) {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                component.setState({ errors : res.fieldErrors });
            }
        });
    },

    putMessageRead :  (id) => {
        fetch(API_ROOT + '/message/' + id + '/read', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
    },

    postLogout : (component, tokenCookie) => {
        fetch(API_ROOT + '/auth/logout', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body : JSON.stringify({
				'token' : tokenCookie
			})
		})
		.then(res => {
			if(res.status == 200){
				component.props.setAuthenticate(false);

				const cookies = new Cookies();
				cookies.remove('token');
			}
		})
    }

}
