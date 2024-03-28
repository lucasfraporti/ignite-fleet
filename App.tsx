import 'react-native-get-random-values'

import { StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components/native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { WifiSlash } from 'phosphor-react-native'
import { AppProvider, UserProvider } from '@realm/react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useNetInfo } from '@react-native-community/netinfo'

import { REALM_APP_ID } from '@env'

import theme from './src/theme'
import { Routes } from './src/routes'

import { RealmProvider, syncConfig } from './src/libs/realm'
import './src/libs/dayjs'

import { Loading } from './src/components/Loading'
import { TopMessage } from './src/components/TopMessage'

import { SignIn } from './src/screens/SignIn'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  const netInfo = useNetInfo()

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          {!netInfo.isConnected && (
            <TopMessage title="Você está offline" icon={WifiSlash} />
          )}

          {/* Se o usuário não estiver logado, o fallback redireciona para o SignIn e se estiver logado ele será redirecionado para a Home */}
          <UserProvider fallback={SignIn}>
            {/* O fallback será ativo enquanto o carregamento do banco estiver ativo... */}
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
