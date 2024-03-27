import { useState } from 'react'
import { Alert } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Realm, useApp } from '@realm/react'

import { Container, Title, Slogan } from './styles'

import backgroundImg from '../../assets/background.png'

import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env'

import { Button } from '../../components/Button'

GoogleSignin.configure({
  scopes: ['profile', 'email'],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
})

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const app = useApp()

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)
      const { idToken } = await GoogleSignin.signIn()

      if (idToken) {
        const credentials = Realm.Credentials.jwt(idToken)
        await app.logIn(credentials)
      } else {
        Alert.alert(
          'Falha ao autenticar',
          'Não foi possível autenticar-se com a sua conta Google.',
        )
      }
    } catch (error) {
      console.error(error)
      setIsAuthenticating(false)
      Alert.alert(
        'Falha ao autenticar',
        'Não foi possível autenticar-se com a sua conta Google.',
      )
    }
  }

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        isLoading={isAuthenticating}
        onPress={handleGoogleSignIn}
      />
    </Container>
  )
}
