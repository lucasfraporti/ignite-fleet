import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { X } from 'phosphor-react-native'
import { BSON } from 'realm'

import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles'

import { useObject, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { getLastAsyncTimestamp } from '../../libs/asyncStorage/syncStorage'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { ButtonIcon } from '../../components/ButtonIcon'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)

  const route = useRoute()
  const { id } = route.params as RouteParamsProps

  const realm = useRealm()
  const { goBack } = useNavigation()

  console.log(Historic)

  const historic = useObject(Historic, new BSON.UUID(id))

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'

  function handleRemoveVehicleUsed() {
    Alert.alert('Cancelar utilização', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Cancelar', onPress: () => removeVehicleUsage() },
    ])
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })
    goBack()
  }

  function handleArrivalRegister() {
    try {
      if (!historic) {
        Alert.alert(
          'Veículo não encontrado',
          'Não foi possível obter os dados para registrar a chegada do veículo.',
        )
      }

      realm.write(() => {
        historic.status = 'arrival'
        historic.updated_at = new Date()
      })

      Alert.alert('Chegada', 'Chegada do veículo registrada com sucesso!')
      goBack()
    } catch (error) {
      console.error(error)
      Alert.alert(
        'Erro de registro',
        'Não foi possível registrar a chegada do veículo.',
      )
    }
  }

  useEffect(() => {
    getLastAsyncTimestamp().then((lastSync) => {
      setDataNotSynced(historic?.updated_at.getTime() > lastSync)
    })
  }, [])

  return (
    <Container>
      <Header title={title} />

      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsed} />
          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          {historic?.status === 'departure' ? ' partida ' : ' chegada '}
          pendente...
        </AsyncMessage>
      )}
    </Container>
  )
}
