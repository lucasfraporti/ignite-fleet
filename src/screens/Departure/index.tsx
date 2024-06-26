import { useEffect, useRef, useState } from 'react'
import { TextInput, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useUser } from '@realm/react'
import {
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords,
} from 'expo-location'
import { Car } from 'phosphor-react-native'

import { Container, Content, Message, MessageContent } from './styles'

import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { getAddressLocation } from '../../utils/getAddressLocation'
import { openSettings } from '../../utils/openSettings'

import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'

import { startLocationTask } from '../../tasks/backgroundTaskLocation'

import { LicensePlateInput } from '../../components/LicensePlateInput'
import { Header } from '../../components/Header'
import { TextAreaInput } from '../../components/TextAreaInput'
import { Button } from '../../components/Button'
import { Loading } from '../../components/Loading'
import { LocationInfo } from '../../components/LocationInfo'
import { Map } from '../../components/Map'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null)

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  const realm = useRealm()
  const user = useUser()

  const { goBack } = useNavigation()

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a placa do veículo corretamente.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Descrição inválida',
          'A descrição é inválida. Por favor, informe a finalidade da utilização do veículo.',
        )
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          'Localização inválida',
          'Não foi possível obter a sua localização atual. Tente novamente recarregando o aplicativo.',
        )
      }

      setIsRegistering(true)

      const backgroundPermissions = await requestBackgroundPermissionsAsync()

      if (!backgroundPermissions.granted) {
        setIsRegistering(false)
        return Alert.alert(
          'Permissão de localização',
          `É necessário que você aceite as permissões para utilizar o aplicativo.${'\n'}Acesse as configurações do aplicativo e habilite a permissão da localização durante todo o tempo.`,
          [
            {
              text: 'Acessar as configurações',
              onPress: () => openSettings(),
            },
          ],
        )
      }

      // Mesmo com o aplicativo fechado, a localização continua sendo atualizada.
      await startLocationTask()

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
            coords: [
              {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                timestamp: new Date().getTime(),
              },
            ],
          }),
        )
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso!')
      goBack()
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Erro de registro',
        'Não foi possível registrar a saída do veículo.',
      )
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission()
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync(
      {
        // Nível de precisão da localização
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords)

        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address)
            }
          })
          .finally(() => setIsLoadingLocation(false))
      },
    ).then((response) => (subscription = response))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [locationForegroundPermission?.granted])

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <MessageContent>
          <Message>
            Você precisa permitir que o aplicativo tenha acesso à localização
            para utilizar essa funcionalidade.{'\n'}
            Por favor, acesse as configurações do seu dispositivo para conceder
            esta permissão.
          </Message>

          <Button title="Abrir configurações" onPress={openSettings} />
        </MessageContent>
      </Container>
    )
  }

  if (isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}

          <Content>
            {currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              // Como o padrão é multiline, preciso dessa configuração para clicar no botão do teclado e não quebrar a linha
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
