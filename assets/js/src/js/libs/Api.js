import { API_ROOT } from '../api-config';
import axios from 'axios';
import Cookies from 'universal-cookie';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const API = {

    getRoom : (setRooms) => {
        axios.get(API_ROOT + '/room/')
			.then(res => {
				setRooms(res.data.rooms);
			});
    },

    getRoomById : (id, room, setRoom) => {
        axios.get(API_ROOT + '/room/' + id, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => {
            res.data.featuresObject = room.featuresObject;

            for (let i = 0; i < res.data.features.length; i++) {
                res.data.featuresObject[res.data.features[i]] = true
            }

            setRoom(res.data);
        });
    },

    postRoom : (newRoom, resetForm, updateRooms, setErrors) => {
        axios.post(API_ROOT + '/room/', 
        JSON.stringify(newRoom),
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 201){
                resetForm();
                updateRooms();
            } else {
                return res.data;
            }
        })
        .catch(res => {
            setErrors(res.response.data.fieldErrors);
        });
    },

    putRoom : (id, room, resetForm, fetchRoomDetails, setErrors) => {
        axios.put(API_ROOT + '/room/' + id,
            JSON.stringify(room),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            .then(res => {
                if(res.status == 202){
                    resetForm();
                    fetchRoomDetails();
                } else {
                    return res.data;
                }
            })
            .catch(res => {
                setErrors(res.response.data.fieldErrors);
            });
    },

    postBooking : (booking, setComplete, setErrors) => {
        axios.post(API_ROOT + '/booking/',
            booking,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            .then(res => {
                if (res.status == 201){
                    setComplete(true)
                } else {
                    return res.data;
                }
            })
            .catch(res => {
                if (res.response.status == 409){
                    setErrors(["The room dates are either invalid or are already booked for one or more of the dates that you have selected."])
                } else {
                    setErrors(res.response.data.fieldErrors);
                }
            });
    },

    getBranding : (setBranding) => {
        axios.get(API_ROOT + '/branding/', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => {
            setBranding(res.data);
        });
    },

    putBranding : (branding, setErrors, toggleModal) => {
        axios.put(API_ROOT + '/branding/',
            JSON.stringify(branding),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(res => {
                if(res.status == 202){
                    setErrors({});
                    toggleModal(true)
                }
            })
            .catch(res => {
                setErrors(res.response.data.fieldErrors);
            })
    },
    

    getRoomReport : (roomid, setEvents) => {
        axios.get(API_ROOT + '/report/room/' + roomid, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            setEvents(res.data.report);
        })
    },

    getReport : (setReport) => {
        axios.get(API_ROOT + '/report/')
            .then(body => {
                setReport(body.data.report);
            });
    },

    getNotificationCount : (updateCount) => {
        axios.get(API_ROOT + '/message/count', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            updateCount(res.data.count);
        })
    },

    getMessages : (setMessages) => {
        axios.get(API_ROOT + '/message/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            setMessages(res.data.messages);
        })
    },

    deleteMessage : (id, refreshMessageList) => {
        axios.delete(API_ROOT + '/message/' + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            refreshMessageList();
        })
    },

    getMessage : (id, setMessage) => {
        axios.get(API_ROOT + '/message/' + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            setMessage(res.data);
        })
    },

    postMessage : (contact, setSubmitted, setErrors) => {
        axios.post(API_ROOT + '/message/',
            JSON.stringify(contact),{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 201){
                setSubmitted(true);
            }
        })
        .catch(res => {
            setErrors(res.response.data.fieldErrors);
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

    postLogout : (setAuthenticate, tokenCookie) => {
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
				setAuthenticate(false);

				const cookies = new Cookies();
				cookies.remove('token');
			}
		})
    },

    postValidation : (setAuthenticate, cookies) => {
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
                    setAuthenticate(true);
                }
            })
            .catch()
    },

    deleteBooking : (id, getBookings) => {
        axios.delete(API_ROOT + '/booking/' + id, {
			credentials: 'include',
        })
        .then(res => {
            if(res.status == 202){
                getBookings();
            }
        })
        .catch(e => console.log(e))
    },

    updateBooking : (booking, toggleEdit, getBookings) => {
        axios.put(API_ROOT + '/booking/' + booking.bookingid,
            JSON.stringify(booking),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then(res => {
                toggleEdit(false)
                getBookings();
            })
            .catch(e => console.log(e));
    },

    postLogin : (login, setAuthenticate, setError) => {
        axios.post(API_ROOT + '/auth/login',
            JSON.stringify(login), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status === 200){
                setAuthenticate(true);
            } else {
                setError(true);
            }
        })
        .catch(e => {
            setError(true);
            console.log("Failed to authenticate");
            console.log(e);
        })
    },

    getBookingsByRoomId : (roomid, setBookings) => {
        axios.get(API_ROOT + '/booking/?roomid=' + roomid, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => {
            setBookings(res.data.bookings);
        })
        .catch(e => console.log(e));
    },

    deleteAll : (roomid, updateRooms) => {
        axios.get(API_ROOT + '/booking/?roomid=' + roomid, {
            method: 'GET'
        })
        .then(res => {
            for(let i = 0; i < res.data.bookings.length; i++){
                axios.delete(API_ROOT + '/booking/' + res.data.bookings[i].bookingid);
            }

            axios.delete(API_ROOT + '/room/' + roomid, {
                credentials: 'include'
            })
            .then(res => {
                if(res.status == 202){
                    updateRooms();
                }
            });
        })
    }

}
