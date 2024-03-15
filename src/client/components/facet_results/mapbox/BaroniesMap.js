import React, { useState, useEffect, useRef } from 'react'
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl'
import Supercluster from 'supercluster'
import useSupercluster from 'use-supercluster'
import 'mapbox-gl/dist/mapbox-gl.css'
import data from './geoJson/centre-points/baronies_centers.json'

const BaroniesMap = () => {
  const points = data.map(item => ({
    type: "Feature",
    properties: { cluster: false, name_en: item.name_en, name_ga: item.name_ga, co_name: item.co_name },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(item.coordinates[0]),
        parseFloat(item.coordinates[1])
      ]
    }
  }))

  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 53,
    longitude: -7,
    zoom: 6
  })
  const mapRef = useRef()
  const bounds = mapRef.current
    ? mapRef.current
        .getMap()
        .getBounds()
        .toArray()
        .flat()
    : null

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 }
  })

  const [selectedMarker, setSelectedMarker] = useState(null)
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken='pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw'
      onViewportChange={setViewport}
      mapStyle='mapbox://styles/aislinggal/clthhdhah002h01ph614cdamz'
      ref={mapRef}
    >
      {clusters.map(cluster => {
      // every cluster point has coordinates
        const [longitude, latitude] = cluster.geometry.coordinates
        // the point may be either a cluster or a point
        const {
          cluster: isCluster,
          point_count: pointCount
        } = cluster.properties
        // we have a cluster to render
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
              offsetLeft={-20} // Adjust as needed
              offsetTop={-20} // Adjust as needed
            >
              <div
                className="cluster-marker"
                style={{
                  width: `${10 + (pointCount / points.length) * 20}px`,
                  height: `${10 + (pointCount / points.length) * 20}px`,
                  color: '#fff',
                  background: '#1978c8',
                  borderRadius: '50%',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  )
                  setViewport({
                    ...viewport,
                    latitude,
                    longitude,
                    zoom: expansionZoom,
                    transitionInterpolator: new FlyToInterpolator({
                      speed: 2
                    }),
                    transitionDuration: 'auto'
                  })
                }}
              >
                {pointCount}
              </div>
            </Marker>
          )
        }

        // we have a single point to render
        return (
          <Marker
            key={`crime-${cluster.properties.name_en}`}
            latitude={latitude}
            longitude={longitude}
            offsetLeft={-20} // Adjust as needed
            offsetTop={-20} // Adjust as needed
          >
            <div style={{ position: 'absolute', left: -7.5, top: -7.5, width: '15px', height: '15px', backgroundColor: 'blue', borderRadius: '50%', cursor: 'pointer' }} />
          </Marker>
        )
      })}
    </ReactMapGL>
  )
}
export default BaroniesMap
