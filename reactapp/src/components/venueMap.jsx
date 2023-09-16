import React from 'react'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
    lat: 39.8283,
    lng: -98.5795
  };
const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
}

function MyComponent(props) {
    const location = props.location;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyASJ4xGAbnjoTbRDnrA30mV6FVJCr4qM2k"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(location);
    // map.fitBounds(bounds);
    map.setZoom(14)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  
  return isLoaded ? (
      <GoogleMap
        options = {OPTIONS}
        mapContainerStyle={containerStyle}
        center={props.location}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <MarkerF position={location} />
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)