import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from './geoJson/centre-points/provinces_centers.json';

// Define your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJjbG82ZzIzNXgwb3J2MmtvMmVrMDh3b3E2In0.wzGjrfYTRwGdbuuWSDCBuw';

const ProvincesMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/aislinggal/clthhifae01aj01pja0dabz1k',
      center: [53, -7], // Initial center coordinates
      zoom: 1 // Initial zoom level
    });

    mapRef.current = map;

    // Add navigation controls to the map
    map.addControl(new mapboxgl.NavigationControl());

    // Add clustering
    map.on('load', () => {
      map.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data.map(item => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: item.coordinates
            },
            properties: {
              name_en: item.name_en,
              name_ga: item.name_ga
            }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'markers',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'markers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'markers',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    });

    // Add onclick event to each unclustered marker to show popup
    map.on('click', 'unclustered-point', e => {
      setSelectedMarker(e.features[0].properties.name_en);
      const coordinates = e.features[0].geometry.coordinates.slice();
      const nameEn = e.features[0].properties.name_en;
      const nameGa = e.features[0].properties.name_ga;
      const lat = e.features[0].geometry.coordinates[1];
      const long = e.features[0].geometry.coordinates[0];

      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);">
          <h2>${nameEn}</h2>
          <h3>${nameGa}</h3>
          <p>Latitude: ${lat}</p>
          <p>Longitude: ${long}</p>
          <button id="buttonClose" style="position: absolute; top: 5px; right: 5px; background-color: transparent; border: none; cursor: pointer; font-size: 16px; color: #333;">&times;</button>
          <div>
            <button id="button1" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s; margin-right: 5px;">Oscar Search</button>
            <button id="button2" style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">Action 2</button>
          </div>
        </div>
      `;

      // Attach click event listener to the "Action 1" button
      popupContent.querySelector('#button1').addEventListener('click', () => handleButtonClick(nameEn));

      // Attach click event listener to the close button
      popupContent.querySelector('#buttonClose').addEventListener('click', () => {
        if (popupRef.current) {
          popupRef.current.remove();
          setSelectedMarker(null);
        }
      });

      // Close the previous popup if any
      if (popupRef.current) {
        popupRef.current.remove();
      }

      const popup = new mapboxgl.Popup({ closeButton: false })
        .setLngLat(coordinates)
        .setDOMContent(popupContent)
        .addTo(map);
      
      // Update popupRef with the new popup instance
      popupRef.current = popup;
    });

    // Add event listener for clicking on cluster markers
    map.on('click', 'clusters', e => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('markers').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
    });

    // Listen to moveend event to check if selected marker is still visible after map movement
    map.on('moveend', () => {
      if (selectedMarker && popupRef.current) {
        const markerFeature = data.find(item => item.name_en === selectedMarker);
        if (markerFeature) {
          const markerCoordinates = markerFeature.coordinates;
          const markerLngLat = new mapboxgl.LngLat(markerCoordinates[0], markerCoordinates[1]);
          if (!map.getBounds().contains(markerLngLat)) {
            popupRef.current.remove();
            setSelectedMarker(null);
          }
        }
      }
    });

    return () => map.remove(); // Clean up on unmount
  }, []); // Empty dependency array for initial setup

  // Function to handle button click for "Action 1"
  function handleButtonClick(nameEn) {
    const markerName = nameEn
    window.open(`https://oscar.virtualtreasury.ie/oscar/index.html?text=${markerName}`)
  }

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default ProvincesMap;
