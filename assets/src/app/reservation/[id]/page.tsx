
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import { Branding } from '@/types/branding';
import HomeNav from '@/components/HomeNav';
import Breadcrumb from '@/components/reservation/Breadcrumb';
import RoomDetails from '@/components/reservation/RoomDetails';
import SimilarRooms from '@/components/reservation/SimilarRooms';
import BookingForm from '@/components/reservation/BookingForm';

import '@/styles/reservations.css';
import { Room } from '@/types/room';

export default function Reservation({params}: {params: Promise<{ id: string }>}) {

    const unwrappedParams = React.use(params);

    const urlParams = useSearchParams();
    const checkin = urlParams.get('checkin');
    const checkout = urlParams.get('checkout');
    
    const [branding, setBranding] = useState<Branding | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    
    useEffect(() => {
        const fetchRoom = async () => {
            const response = await fetch(`/ui-api/room/${unwrappedParams.id}`);
            const data = await response.json();
            setRoom(data);
        };
        fetchRoom();

        const fetchBranding = async () => {
            const response = await fetch('/ui-api/branding');
            const data = await response.json();
            setBranding(data);
        };
        fetchBranding();
    }, []);

    if (!room || !branding) {
        return (
            <div className="container-fluid text-center p-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden"></span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <HomeNav branding={branding} />

            <Breadcrumb roomType={room.type} />

            <div className="container my-5">
                <div className="row">
                    <RoomDetails room={room} />
                    <BookingForm room={room} />
                </div>
            </div>

            <SimilarRooms id={room.roomid} queryString={"?checkin=" + checkin + "&checkout=" + checkout}/>

            <Footer branding={branding} />
        </div>
    )
}