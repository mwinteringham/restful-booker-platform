import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Room as RoomType } from "@/types/room";
import { Booking } from "@/types/booking";
import { set } from "react-datepicker/dist/date_utils";

interface RoomDetailsProps {
    room: RoomType;
}

interface Event {
    start: Date;
    end: Date;
    title: string;
}

const BookingForm: React.FC<RoomDetailsProps> = ({ room }) => {

    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState<Event[]>([]);
    const [newEvent, setNewEvent] = useState<Event[]>([]);
    const [slots, setSlots] = useState<number>(0);
    const [toggleBooking, setToggleBooking] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<Booking>();
    const [bookingErrors, setBookingErrors] = useState<string[]>([]);
    const [confirmedBooking, setConfirmedBooking] = useState<boolean>(false);

    const urlParams = useSearchParams();
    const checkin = urlParams.get('checkin');
    const checkout = urlParams.get('checkout');

    useEffect(() => {
        const fetchRoomReport = async () => {
            try {
            const response = await fetch(`/api/report/room/${room.roomid}`);
            if (response.ok) {
                const data = await response.json();
                
                setEvents(data);
            }
            } catch (error) {
                console.error('Error fetching room report:', error);
            }
        };

        const setCurrentSelection = async () => {
            if (checkin && checkout) {
                const startMoment = moment(checkin, "YYYY-MM-DD");
                const endMoment = moment(checkout, "YYYY-MM-DD");

                const diff = endMoment.diff(startMoment, 'days');
                setSlots(diff);

                const start = startMoment.toDate();
                const end = endMoment.add(1).toDate();

                setNewEvent([{start, end, title: 'Selected' }]);
            }
        };
        
        fetchRoomReport();
        setCurrentSelection();
    }, [room.roomid]);

    const handleSelect = (result: { start: Date; end: Date; slots: Date[] }) => {
        const start = result.start;
        const end = result.end;
        setSlots(result.slots.length);

        if (start && end && result.slots.length > 1) {
            setNewEvent([{ start, end, title: 'Selected' }]);
        }
    };

    const submitDatesForBooking = () => {
        const initialBookingDetails: Booking = {
            roomid: room.roomid,
            firstname: '',
            lastname: '',
            depositpaid: false,
            bookingdates : {
                checkin: moment(newEvent[0].start).format('YYYY-MM-DD'),
                checkout: moment(newEvent[0].end).format('YYYY-MM-DD')
            },
            email: '',
            phone: ''
        }

        setBookingDetails(initialBookingDetails);
        setToggleBooking(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingDetails((prevDetails) => {
            if (!prevDetails) {
                return {
                    roomid: room.roomid,
                    firstname: name === 'firstname' ? value : '',
                    lastname: name === 'lastname' ? value : '',
                    depositpaid: false,
                    bookingdates: {
                        checkin: moment(newEvent[0].start).format('YYYY-MM-DD'),
                        checkout: moment(newEvent[0].end).format('YYYY-MM-DD')
                    },
                    email: name === 'email' ? value : '',
                    phone: name === 'phone' ? value : ''
                };
            }
            return {
                ...prevDetails,
                [name]: value,
            };
        });
    };

    const submitBooking = async () => {
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });
            if (response.ok) {
                setConfirmedBooking(true)
            } else {
                const errorData = await response.json();
                setBookingErrors(errorData.errors);
            }
        } catch (error) {
            console.error('Error booking room:', error);
        }
    }

    const cancelBooking = () => {
        setToggleBooking(false);
        setBookingErrors([]);
    }

    if(newEvent.length === 0) {
        return (
            <div className="col-lg-4">
                <div className="card border-0 shadow booking-card">
                    <div className="container-fluid text-center p-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if(toggleBooking && confirmedBooking) {
        return (
            <div className="col-lg-4">
                <div className="card border-0 shadow booking-card">
                    <div className="card-body">
                        <h2 className="card-title fs-4 fw-bold mb-3">Booking Confirmed</h2>
                        <p>Your booking has been confirmed for the following dates:</p>
                        <p className="text-center pt-2"><strong>{bookingDetails?.bookingdates.checkin} - {bookingDetails?.bookingdates.checkout}</strong></p>
                        <a type="button" className="btn btn-primary w-100 mb-3 mt-3" href='/'>Return home</a>
                    </div>
                </div>
            </div>
        )
    }

    if(toggleBooking) {
        return (
            <div className="col-lg-4">
                <div className="card border-0 shadow booking-card">
                <div className="card-body">
                    <h2 className="card-title fs-4 fw-bold mb-3">Book This Room</h2>
                    
                    <div className="d-flex align-items-baseline mb-4">
                        <span className="fs-2 fw-bold text-primary me-2">£{room.roomPrice}</span>
                        <span className="text-muted">per night</span>
                    </div>
                        <form>
                            <div className="input-group mb-3 room-booking-form">
                                <span className="input-group-text" id="basic-addon1">
                                    <span className="fa fa-id-card"></span>
                                </span>
                                <input className="form-control room-firstname" placeholder="Firstname" aria-label="Firstname" aria-describedby="basic-addon1" type="text" value={bookingDetails?.firstname} onChange={e => handleChange(e)} name="firstname" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">
                                    <span className="fa fa-id-card"></span>
                                </span>
                                <input className="form-control room-lastname" placeholder="Lastname" aria-label="Lastname" aria-describedby="basic-addon1" type="text" value={bookingDetails?.lastname} onChange={e => handleChange(e)} name="lastname" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">
                                    <span className="fa fa-envelope"></span>
                                </span>
                                <input className="form-control room-email" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" type="text" value={bookingDetails?.email} onChange={e => handleChange(e)} name="email" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">
                                    <span className="fa fa-phone"></span>
                                </span>
                                <input className="form-control room-phone" placeholder="Phone" aria-label="Phone" aria-describedby="basic-addon1" type="text" value={bookingDetails?.phone} onChange={e => handleChange(e)} name="phone" />
                            </div>

                            {bookingErrors.length > 0 && (
                                <div className="alert alert-danger" role="alert">
                                    <ul>
                                        {bookingErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
    
                            <div className="card bg-light border-0 mb-4">
                                <div className="card-body">
                                <h3 className="fs-5 mb-3">Price Summary</h3>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>£{room.roomPrice} x {slots} nights</span>
                                    <span>£{room.roomPrice * slots}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Cleaning fee</span>
                                    <span>£25</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Service fee</span>
                                    <span>£15</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Total</span>
                                    <span>£{room.roomPrice * slots + 40}</span>
                                </div>
                                </div>
                            </div>
    
                            <button type="button" className="btn btn-primary w-100 mb-3" onClick={submitBooking}>Reserve Now</button>
                            <button type="button" className="btn btn-secondary w-100 mb-3" onClick={cancelBooking}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="col-lg-4">
                <div className="card border-0 shadow booking-card">
                <div className="card-body">
                    <h2 className="card-title fs-4 fw-bold mb-3">Book This Room</h2>
                    
                    <div className="d-flex align-items-baseline mb-4">
                        <span className="fs-2 fw-bold text-primary me-2">£{room.roomPrice}</span>
                        <span className="text-muted">per night</span>
                    </div>
                        <form>
                            <div className="mb-4">
                                <Calendar
                                    localizer={localizer}
                                    onSelectSlot={handleSelect}
                                    defaultView="month"
                                    selectable
                                    events={newEvent.concat(events)}
                                    style={{ height: "400px" }}
                                    views={['month']}
                                />
                            </div>
    
                            <div className="card bg-light border-0 mb-4">
                                <div className="card-body">
                                <h3 className="fs-5 mb-3">Price Summary</h3>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>£{room.roomPrice} x {slots} nights</span>
                                    <span>£{room.roomPrice * slots}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Cleaning fee</span>
                                    <span>£25</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Service fee</span>
                                    <span>£15</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Total</span>
                                    <span>£{room.roomPrice * slots + 40}</span>
                                </div>
                                </div>
                            </div>
    
                            <button type="button" id="doReservation" className="btn btn-primary w-100 mb-3" onClick={submitDatesForBooking}>Reserve Now</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

export default BookingForm;