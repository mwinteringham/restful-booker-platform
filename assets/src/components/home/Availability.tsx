'use client';

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import HotelRoomInfo from "./HotelRoomInfo";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { enGB } from 'date-fns/locale/en-GB';
registerLocale('en-GB', enGB)
setDefaultLocale('en-GB');

import { Room } from "@/types/room";
import { Availability as AvailabilityType } from "@/types/availability";

export default function Availability() {

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [availabilityDates, setAvailabilityDates] = useState<AvailabilityType>({ checkIn: today, checkOut: tomorrow });

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch('/api/room');
            const data = await response.json();
            setRooms(data.rooms || []);
        };
        fetchRooms();
    }, []);

    const updateState = (date: Date | null, name: string) => {
        if (date) {
            setAvailabilityDates((prevState) => ({
                ...prevState,
                [name]: date,
            }));
        }
    };

    const checkAvailability = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const formatDate = (date: Date) => {
            return date.toISOString().split('T')[0];
        };
        
        const checkInFormatted = formatDate(availabilityDates.checkIn);
        const checkOutFormatted = formatDate(availabilityDates.checkOut);
        
        try {
            const response = await fetch(`/api/room?checkin=${checkInFormatted}&checkout=${checkOutFormatted}`);
            const data = await response.json();
            setRooms(data.rooms || []);
            document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching available rooms:', error);
        }
    };

    return (
        <div>
            <section id="booking" className="py-3">
                <div className="container">
                    <div className="card shadow booking-card">
                        <div className="card-body p-4">
                            <h3 className="card-title text-center mb-4">Check Availability & Book Your Stay</h3>
                            <form>
                                <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="checkin" className="form-label">Check In</label>
                                    <DatePicker wrapperClassName="dateWrapper" dateFormat="P" className='form-control' selected={availabilityDates?.checkIn} onChange={(date : Date | null) => updateState(date, 'checkIn')} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="checkout" className="form-label">Check Out</label>
                                    <DatePicker wrapperClassName="dateWrapper" dateFormat="P" className='form-control' selected={availabilityDates?.checkOut} onChange={(date: Date | null) => updateState(date, 'checkOut')} />
                                </div>
                                <div className="col-2"></div>
                                <div className="col-8 mt-4">
                                    <button type="button" className="btn btn-primary w-100 py-2" onClick={checkAvailability}>Check Availability</button>
                                </div>
                                <div className="col-2"></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section id="rooms" className="section-divider">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5">Our Rooms</h2>
                        <p className="lead text-muted">Comfortable beds and delightful breakfast from locally sourced ingredients</p>
                    </div>
                    
                    <div className="row g-4">
                        {rooms.slice(0, 3).map((roomDetails) => {
                            return <div key={roomDetails.roomid} className="col-md-6 col-lg-4" ><HotelRoomInfo roomDetails={roomDetails} queryString={"?checkin=" + moment(availabilityDates.checkIn).format("YYYY-MM-DD") + "&checkout=" + moment(availabilityDates.checkOut).format("YYYY-MM-DD") } /></div>
                        })}
                    </div>
                </div>
            </section>
        </div>
    );

}