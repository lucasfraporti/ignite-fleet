import { useRef } from 'react'
import MapView, {
  PROVIDER_GOOGLE,
  MapViewProps,
  LatLng,
  Marker,
  Polyline,
} from 'react-native-maps'
import { useTheme } from 'styled-components/native'
import { Car, FlagCheckered } from 'phosphor-react-native'

import { IconBox } from '../IconBox'

type Props = MapViewProps & {
  coordinates: LatLng[]
}

export function Map({ coordinates, ...rest }: Props) {
  const { COLORS } = useTheme()

  const mapRef = useRef<MapView>(null)
  const lastCoordinate = coordinates[coordinates.length - 1]

  async function onMapLoaded() {
    if (coordinates.length > 1) {
      mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
        edgePadding: {
          top: 110,
          right: 110,
          bottom: 110,
          left: 110,
        },
      })
    }
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ width: '100%', height: 200 }}
      region={{
        latitude: lastCoordinate.latitude,
        longitude: lastCoordinate.longitude,
        // Definindo a proximidade do mapa
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onMapLoaded={onMapLoaded}
      {...rest}
    >
      <Marker identifier="departure" coordinate={coordinates[0]}>
        <IconBox size="SMALL" icon={Car} />
      </Marker>

      {coordinates.length > 1 && (
        <>
          <Marker identifier="arrival" coordinate={lastCoordinate}>
            <IconBox size="SMALL" icon={FlagCheckered} />
          </Marker>

          <Polyline
            coordinates={[...coordinates]}
            strokeColor={COLORS.GRAY_700}
            strokeWidth={6}
          />
        </>
      )}
    </MapView>
  )
}
