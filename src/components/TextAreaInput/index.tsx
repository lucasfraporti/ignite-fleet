import { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Container, Input, Label } from './styles'

type Props = TextInputProps & {
  label: string
}

const TextAreaInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    const { COLORS } = useTheme()

    return (
      <Container>
        <Label>{label}</Label>

        <Input
          ref={ref}
          placeholderTextColor={COLORS.GRAY_400}
          multiline
          // Primeira letra da frase será maiúscula
          autoCapitalize="sentences"
          {...rest}
        />
      </Container>
    )
  },
)

export { TextAreaInput }
