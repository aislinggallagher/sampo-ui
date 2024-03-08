import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import placeIcon from '../../../img/markers/location-marker.png'
import data from './geoJson/centre-points/civil_parishes_centers.json'

const ParishesMap = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 53,
    longitude: -7,
    zoom: 6
  })

  const [selectedMarker, setSelectedMarker] = useState(null)

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/aislinggal/clthfeqgu01kl01pigwrn3xl0'
      mapboxApiAccessToken='pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw'
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {data.map((marker, index) => (
        <Marker key={index} longitude={marker.coordinates[0]} latitude={marker.coordinates[1]}>
          <div style={{ position: 'absolute', left: -7.5, top: -7.5, width: '15px', height: '15px', backgroundColor: 'blue', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setSelectedMarker(marker)} />
        </Marker>
      ))}

      {selectedMarker && (
        <Popup
          longitude={selectedMarker.coordinates[0]}
          latitude={selectedMarker.coordinates[1]}
          onClose={() => setSelectedMarker(null)}
          closeOnClick={false} // Prevent popup from closing when clicked outside
        >
          <div className='popup'>
            <h2>{selectedMarker.name_en}</h2>
            <h2>{selectedMarker.name_ga}</h2>
            <div className='popup-content'>
              <p>Latitude: {selectedMarker.coordinates[1]}</p>
              <p>Longitude: {selectedMarker.coordinates[0]}</p>
            </div>
            <div className='popup-actions'>
              <button className='popup-button'>Action 1</button>
              <button className='popup-button'>Action 2</button>
            </div>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  )
}

export default ParishesMap
