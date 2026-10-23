import React from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Branding } from '@/types/branding';

const getProvider = (x: number, y: number, z: number) => `https://c.tile.openstreetmap.org/${z}/${x}/${y}.png`;

// Take branding details as props
interface HotelMapProps {
  branding: Branding;
}

// Define the HotelMap component
const HotelMap: React.FC<HotelMapProps> = ({ branding }) => {

  const marker = [
    <Marker 
      key={`marker_${name}`} 
      anchor={[branding?.map.latitude, branding?.map.longitude]} 
      payload={name} />
  ]

  return (
    <section id="location" className="section-divider bg-light py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5">Our Location</h2>
          <p className="lead text-muted">Find us in the beautiful {branding?.address.postTown} countryside</p>
        </div>
        
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body p-0">
              <Map
                defaultCenter={[branding?.map.latitude, branding?.map.longitude]}
                defaultZoom={17}
                provider={getProvider}
                mouseEvents={false}
              >
              
                {marker}
              </Map>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="h4 mb-4">Contact Information</h3>
                
                <div className="d-flex mb-4">
                  <div className="me-3 text-primary">
                    <i className="bi bi-geo-alt fs-4"></i>
                  </div>
                  <div>
                    <h5>Address</h5>
                    <p className="mb-0">{branding.address.line1}, {branding.address.line2}, {branding.address.postTown}, {branding.address.county}, {branding.address.postCode}</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="me-3 text-primary">
                    <i className="bi bi-telephone fs-4"></i>
                  </div>
                  <div>
                    <h5>Phone</h5>
                    <p className="mb-0">{branding?.contact.phone}</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="me-3 text-primary">
                    <i className="bi bi-envelope fs-4"></i>
                  </div>
                  <div>
                    <h5>Email</h5>
                    <p className="mb-0">{branding?.contact.email}</p>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <h4 className="h5 mb-3">Getting Here</h4>
                <p>{branding?.directions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

export default HotelMap; 