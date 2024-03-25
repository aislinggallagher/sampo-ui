import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from './geoJson/centre-points/townlands_centers.json';
import ReactDOM from 'react-dom'; // Import ReactDOM

// Define your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoiYWlzbGluZ2dhbCIsImEiOiJja2N5bGd2bHUwN3V4MnVwYnhrNmtocnJzIn0.vYWwWzwwx5wnYwD3eJdgdQ';

const TownlandsMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/aislinggal/clthhfely001q01qoan7i0tjq',
      center: [-7, 53], // Initial center coordinates
      zoom: 5 // Initial zoom level
    });

    mapRef.current = map;

    // Add navigation controls to the map
    map.addControl(new mapboxgl.NavigationControl());

    // Wait for the map to load
    map.on('load', () => {
      // Add clustering
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
              name_ga: item.name_ga,
              links: item.links
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
          'circle-color': '#ffffff',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000000'
        }
      });

      // Add onclick event to each unclustered marker to show popup
      map.on('click', 'unclustered-point', e => {
        const features = e.features;
        if (!features.length) return;

        const feature = features[0];
        setSelectedMarker(feature.properties.name_en);
        const coordinates = feature.geometry.coordinates.slice();
        const nameEn = feature.properties.name_en;
        const nameGa = feature.properties.name_ga;
        const lat = feature.geometry.coordinates[1];
        const long = feature.geometry.coordinates[0];
        const links = JSON.parse(feature.properties.links);

        // Generate HTML for links
        const linksHTML = `<table>${links.map(
          link => `<tr>${Object.entries(link).map(
            ([type, url]) => `<td><a href="${url}" target="_blank">${type}</a></td>`
          ).join('')}</tr>`
        ).join('')}</table>`;

        // Function to handle button click for "Action 1"
        function handleButtonClick(nameEn) {
          const markerName = nameEn
          window.open(`https://oscar.virtualtreasury.ie/oscar/index.html?text=${markerName}`)
        }

        const closePopup = () => {
          if (popupRef.current) {
            popupRef.current.remove();
            setSelectedMarker(null);
          }
        };

        // Create a container element to hold the JSX content
        const container = document.createElement('div');

        // Render the JSX content into the container element
        ReactDOM.render(
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)' }}>
            <h2>{nameEn}</h2>
            <h3>{nameGa}</h3>
            <p>Latitude: {lat}</p>
            <p>Longitude: {long}</p>
            <button
              style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#333' }}
              onClick={closePopup}
            >&times;</button>
            <div style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: linksHTML }} />
            <div style={{ marginTop: '10px' }}>
              <button
                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', transition: 'background-color 0.3s', position: 'relative', margin: '0 auto' }}
                onClick={() => handleButtonClick(nameEn)}
              >OSCAR Search
              </button>
            </div>
          </div>,
          container
        );

        // Pass the container's DOM node to setDOMContent
        const popup = new mapboxgl.Popup({ closeButton: false, maxWidth: '300px' })
          .setLngLat(coordinates)
          .setDOMContent(container)
          .addTo(map);

        // Close the previous popup if any
        if (popupRef.current) {
          popupRef.current.remove();
        }

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
    });

    return () => map.remove(); // Clean up on unmount
  }, []); // Empty dependency array for initial setup

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default TownlandsMap;
