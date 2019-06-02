import React from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

const getProvider = (x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

export default class HotelMap extends React.Component {

  constructor(){
    super();
  }

  render() {
    if(this.props.mapDetails){
      const marker = [
        <Marker 
          key={`marker_${this.props.name}`} 
          anchor={[this.props.mapDetails.latitude, this.props.mapDetails.longitude]} 
          payload={this.props.name} />
      ]
  
      return (
        <div className="map">
          <Map
            width={window.innerWidth}
            height={600}
            defaultCenter={[this.props.mapDetails.latitude, this.props.mapDetails.longitude]}
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
}
