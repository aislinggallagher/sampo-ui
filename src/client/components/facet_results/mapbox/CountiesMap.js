import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'

const CountiesMap = () => {
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
      mapStyle='mapbox://styles/aislinggal/clthh9gg7002g01ph2kche9or'
      mapboxApiAccessToken='pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw'
      onViewportChange={(viewport) => setViewport(viewport)}
    />
  )
}

export default CountiesMap
