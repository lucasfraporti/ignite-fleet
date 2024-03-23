import { useState } from 'react'
import { Alert } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { Container, Title, Slogan } from './styles'

import backgroundImg from '../../assets/background.png'

import { Button } from '../../components/Button'

GoogleSignin.configure({
  scopes: ['profile', 'email'],
  webClientId: process.env.WEB_CLIENT_ID,
  iosClientId: process.env.IOS_CLIENT_ID,
})

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)
      const { idToken } = await GoogleSignin.signIn()

      if (idToken) {
        console.log(idToken)
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
