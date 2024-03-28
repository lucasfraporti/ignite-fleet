import { IconProps } from 'phosphor-react-native'

import { Container, SizeProps } from './styles'
import { useTheme } from 'styled-components/native'

export type IconBoxProps = (props: IconProps) => JSX.Element

type Props = {
  size?: SizeProps
  icon: IconBoxProps
}

export function IconBox({ icon: Icon, size = 'NORMAL' }: Props) {
  const { COLORS } = useTheme()
  const iconSize = size === 'NORMAL' ? 24 : 16

  return (
    <Container size={size}>
      <Icon size={iconSize} color={COLORS.BRAND_LIGHT} />
    </Container>
  )
}
