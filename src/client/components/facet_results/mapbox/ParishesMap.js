import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'

const bounds = [
  [51.36492148825955, 10.854492187500002], // Southwestcoordinates
  [55.41030721005221, 5.262451171875001] // Northeast coordinates
]

const ParishesMap = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 600,
    latitude: 53.5,
    longitude: -7.5,
    zoom: 9,
    maxBounds: bounds
  })

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/aislinggal/clthfeqgu01kl01pigwrn3xl0'
      mapboxApiAccessToken='pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw'
      onViewportChange={(viewport) => setViewport(viewport)}
    />
  )
}

export default ParishesMap
