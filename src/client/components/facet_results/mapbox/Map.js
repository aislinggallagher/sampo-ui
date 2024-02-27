import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'

const Map = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 600,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  })

  return (
    <ReactMapGL
      {...viewport}
      //mapStyle='mapbox://styles/aislinggal/clsksspgt00kv01pfgmn25mi4'
      mapStyle='mapbox://styles/mapbox/streets-v11'
      mapboxApiAccessToken='pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw'
      onViewportChange={(viewport) => setViewport(viewport)}
    />
  )
}

export default Map
