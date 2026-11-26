'use client';

import React, { useState, useEffect } from "react";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import HotelContact from "@/components/home/HotelContact";
import HotelMap from "@/components/home/HotelMap";
import HotelLogo from "@/components/home/HotelLogo";
import Availability from "@/components/home/Availability";

import { Branding } from "@/types/branding";

export default function Home() {

    const [branding, setBranding] = useState<Branding | null>(null);
        
    useEffect(() => {
        const fetchBranding = async () => {
            const response = await fetch('/ui-api/branding');
            const data = await response.json();
            setBranding(data);
        };
        fetchBranding();
    }, []);

    if (!branding) {
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
            <HotelLogo branding={branding} />
            <Availability />
            <HotelMap branding={branding} />
            <HotelContact contactDetails={branding?.contact} />
            <Footer branding={branding} />
        </div>
    );
}
