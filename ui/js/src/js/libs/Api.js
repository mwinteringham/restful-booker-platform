import { API_ROOT } from '../api-config';
import fetch from 'node-fetch';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const API = {

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
                if(res.status == 200){
                    component.resetForm();
                    component.props.updateRooms();
                } else {
                    return res.json();
                }
            })
            .then(res => {
                if(res){
                    let capturedErrors = [];
                    
                    for(let i = 0; i < res.errors.length; i++){
                        capturedErrors.push(res.errors[i].field.capitalize() + ": " + res.errors[i].defaultMessage);
                    }
    
                    component.setState({ errors : capturedErrors });
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
            if(res.status == 200){
                component.resetForm();
                component.fetchRoomDetails();
            } else {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                let capturedErrors = [];
    
                for(let i = 0; i < res.errors.length; i++){
                    capturedErrors.push(res.errors[i].field.capitalize() + ": " + res.errors[i].defaultMessage);
                }
                
                component.setState({ errors : capturedErrors });
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
            body : JSON.stringify(component.state.newbooking)
        })
        .then(res => {
            if(res.status == 200){
                component.props.fetchRoomDetails();
                component.resetForm();
            } else if (res.status == 409){
                component.setState({ errors : ["The room dates are either invalid or are already booked for one or more of the dates that you have selected."]})
            } else {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                let capturedErrors = [];
                
                for(let i = 0; i < res.errors.length; i++){
                    capturedErrors.push(res.errors[i].field.capitalize() + ": " + res.errors[i].defaultMessage);
                }
    
                component.setState({ errors : capturedErrors });
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
            if(res.status == 200){
                component.setState({showModal : true, errors : {}});
            } else if(res.status == 400) {
                return res.json();
            }
        })
        .then(res => {
            if(res){
                let capturedErrors = [];
                
                for(let i = 0; i < res.errors.length; i++){
                    capturedErrors.push(res.errors[i].field.capitalize() + ": " + res.errors[i].defaultMessage);
                }
    
                component.setState({ errors : capturedErrors });
            }
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
        fetch(API_ROOT + '/message', {
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
        .then(res => res.json())
        .then(res => {
            component.setState({ submitted : true});
        })
    }

}
