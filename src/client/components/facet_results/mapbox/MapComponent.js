import React, { useEffect, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import CountiesMap from './CountiesMap'
import ProvincesMap from './ProvincesMap'
import TownlandsMap from './TownlandsMap'
import ParishesMap from './ParishesMap'
import BaroniesMap from './BaroniesMap'

const MapComponent = () => {
  const [mapType, setMapType] = useState('counties') // Default map type

  const handleButtonClick = (type) => {
    setMapType(type)
  }

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    marginRight: '10px',
    cursor: 'pointer'
  }

  return (
    <>
      <div>
        <center>
          <button style={buttonStyle} onClick={() => handleButtonClick('townlands')}>Townlands Map</button>
          <button style={buttonStyle} onClick={() => handleButtonClick('civil-parishes')}>Civil Parishes Map</button>
          <button style={buttonStyle} onClick={() => handleButtonClick('baronies')}>Baronies Map</button>
          <button style={buttonStyle} onClick={() => handleButtonClick('counties')}>Counties Map</button>
          <button style={buttonStyle} onClick={() => handleButtonClick('provinces')}>Provinces Map</button>
        </center>
      </div>
      {mapType === 'townlands' && <TownlandsMap />}
      {mapType === 'civil-parishes' && <ParishesMap />}
      {mapType === 'baronies' && <BaroniesMap />}
      {mapType === 'counties' && <CountiesMap />}
      {mapType === 'provinces' && <ProvincesMap />}

    </>
  )
}

export default MapComponent
