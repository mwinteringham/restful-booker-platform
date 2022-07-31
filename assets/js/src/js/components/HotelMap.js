import React from 'react';
import { Map } from 'pigeon-maps';
import Marker from 'pigeon-marker';

const getProvider = (x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

const HotelMap = ({name, mapDetails}) => {

  
    if(mapDetails){
      const marker = [
        <Marker 
          key={`marker_${name}`} 
          anchor={[mapDetails.latitude, mapDetails.longitude]} 
          payload={name} />
      ]
  
      return (
        <div className="map">
          <Map
            width={window.innerWidth}
            height={600}
            defaultCenter={[mapDetails.latitude, mapDetails.longitude]}
            defaultZoom={17}
            provider={getProvider}
            mouseEvents={false}
          >
          
          {marker}
          </Map>
        </div>
      );
    } else {
      return <div className="map">
        <p>ERROR: Invalid or details missing for map to render</p>
      </div>
    }
}

export default HotelMap;
