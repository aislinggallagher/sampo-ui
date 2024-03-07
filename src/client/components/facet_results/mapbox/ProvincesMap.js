import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'

const ProvincesMap = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 600,
    latitude: 53,
    longitude: -7,
    zoom: 8
  })

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/aislinggal/clthhifae01aj01pja0dabz1k'
      mapboxApiAccessToken='pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw'
      onViewportChange={(viewport) => setViewport(viewport)}
    />
  )
}

export default ProvincesMap
